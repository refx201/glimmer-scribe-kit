import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Coins, Plus, Minus, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function UserPointsManager() {
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pointsChange, setPointsChange] = useState("");
  const [reason, setReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users-points"],
    queryFn: async () => {
      // First get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, phone, created_at")
        .order("created_at", { ascending: false });
      
      if (profilesError) {
        console.warn("Profiles query error:", profilesError);
        return [];
      }
      
      // Then get all user points
      const { data: pointsData } = await supabase
        .from("user_points")
        .select("user_id, points");
      
      // Merge the data
      const pointsMap = new Map(pointsData?.map(p => [p.user_id, p.points]) || []);
      
      return profilesData?.map(profile => ({
        ...profile,
        user_points: pointsMap.has(profile.id) ? [{ points: pointsMap.get(profile.id) }] : []
      })) || [];
    },
  });

  const handleAddPoints = async (userId: string, amount: number, isAdd: boolean) => {
    try {
      const pointsChange = isAdd ? amount : -amount;
      
      console.log('Updating points:', { userId, pointsChange, reason });
      
      // Call edge function to update points with service role
      const { data, error } = await supabase.functions.invoke('manage-user-points', {
        body: {
          userId,
          pointsChange,
          reason: reason || (isAdd ? "نقاط مضافة" : "نقاط مخصومة")
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Unknown error');

      toast.success(isAdd ? "تم إضافة النقاط بنجاح!" : "تم خصم النقاط بنجاح!");
      
      // Wait a bit for the database to update, then invalidate all related queries
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Invalidate both admin and user queries
      await queryClient.invalidateQueries({ queryKey: ["admin-users-points"] });
      await queryClient.invalidateQueries({ queryKey: ["user-points"] });
      
      setIsDialogOpen(false);
      setPointsChange("");
      setReason("");
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Error updating points:", error);
      toast.error("فشل تحديث النقاط: " + (error.message || "خطأ غير معروف"));
    }
  };

  const q = searchEmail.trim().toLowerCase();
  const filteredUsers = users?.filter((user) => {
    if (!q) return true;
    const haystack = [user.email, user.full_name, (user as any).phone, (user as any).phone_number]
      .map((v) => (v || "").toString().toLowerCase());
    return haystack.some((v) => v.includes(q));
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Coins className="h-6 w-6 text-yellow-500" />
        <h1 className="text-3xl font-bold">إدارة نقاط المستخدمين</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="ابحث عن مستخدم بالبريد الإلكتروني أو الاسم..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="pr-10 text-right"
            dir="rtl"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : !filteredUsers?.length ? (
        <Card className="p-8 text-center text-muted-foreground">
          لا يوجد مستخدمين
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-right">
                    {user.full_name || user.email?.split('@')[0] || "مستخدم"}
                  </h3>
                  <p className="text-sm text-muted-foreground text-right">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2 justify-end">
                    <span className="text-2xl font-bold text-yellow-600">
                      {user.user_points?.[0]?.points || 0}
                    </span>
                    <Coins className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>

                <Dialog open={isDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    setSelectedUser(null);
                    setPointsChange("");
                    setReason("");
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setSelectedUser(user);
                      setIsDialogOpen(true);
                    }}>
                      تعديل النقاط
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-right">
                        تعديل نقاط {user.full_name || user.email}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="points" className="text-right block">
                          عدد النقاط
                        </Label>
                        <Input
                          id="points"
                          type="number"
                          placeholder="0"
                          value={pointsChange}
                          onChange={(e) => setPointsChange(e.target.value)}
                          className="text-right"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason" className="text-right block">
                          السبب (اختياري)
                        </Label>
                        <Textarea
                          id="reason"
                          placeholder="سبب التعديل..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="text-right"
                          dir="rtl"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          variant="outline"
                          onClick={() => {
                            const amount = parseInt(pointsChange);
                            if (isNaN(amount) || amount <= 0) {
                              toast.error("الرجاء إدخال رقم صحيح");
                              return;
                            }
                            handleAddPoints(user.id, amount, false);
                          }}
                        >
                          <Minus className="h-4 w-4 ml-2" />
                          خصم
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() => {
                            const amount = parseInt(pointsChange);
                            if (isNaN(amount) || amount <= 0) {
                              toast.error("الرجاء إدخال رقم صحيح");
                              return;
                            }
                            handleAddPoints(user.id, amount, true);
                          }}
                        >
                          <Plus className="h-4 w-4 ml-2" />
                          إضافة
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
