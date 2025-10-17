import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface PhoneNumberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function PhoneNumberDialog({ open, onOpenChange, userId }: PhoneNumberDialogProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error("الرجاء إدخال رقم الهاتف");
      return;
    }

    setLoading(true);
    try {
      // Update user metadata with phone number
      const { error: updateError } = await supabase.auth.updateUser({
        data: { phone }
      });

      if (updateError) throw updateError;

      // Also update in profiles table if it exists
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          phone,
          phone_verified: false,
          updated_at: new Date().toISOString()
        });

      if (profileError) console.warn('Profile update failed:', profileError);

      toast.success("تم حفظ رقم الهاتف بنجاح!");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving phone:', error);
      toast.error("فشل حفظ رقم الهاتف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">أدخل رقم هاتفك</DialogTitle>
          <DialogDescription className="text-right">
            لإكمال ملفك الشخصي، الرجاء إدخال رقم هاتفك
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-right block">
              رقم الهاتف
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="05XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-right"
              dir="rtl"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              تخطي
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
