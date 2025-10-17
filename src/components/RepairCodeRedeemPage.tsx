import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, CheckCircle, XCircle, User, Phone, Calendar, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

const RepairCodeRedeemPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchCode, setSearchCode] = useState("");
  const [selectedCode, setSelectedCode] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const { data: codeData, isLoading: isSearching } = useQuery({
    queryKey: ["repair-code", searchCode],
    queryFn: async () => {
      if (!searchCode) return null;
      
      const { data, error } = await supabase
        .from("repair_codes")
        .select("*")
        .eq("code", searchCode.toUpperCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error("الكود غير موجود");
        }
        throw error;
      }
      
      return data;
    },
    enabled: false,
  });

  const redeemMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCode) throw new Error("No code selected");
      if (!customerName || !customerPhone) {
        throw new Error("يرجى إدخال اسم ورقم هاتف العميل");
      }

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("repair_codes")
        .update({
          is_used: true,
          customer_name: customerName,
          customer_phone: customerPhone,
          used_at: now,
        })
        .eq("id", selectedCode.id)
        .select()
        .single();

      if (error) throw error;

      // Send Telegram notification
      await supabase.functions.invoke('send-telegram-notification', {
        body: {
          type: 'repair_code',
          data: {
            ...data,
            used_at: now
          }
        }
      });
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "تم الاستلام بنجاح",
        description: "تم تسجيل استلام رمز الصيانة",
      });
      queryClient.invalidateQueries({ queryKey: ["repair-code", searchCode] });
      setCustomerName("");
      setCustomerPhone("");
      // Re-fetch the code data
      handleSearch();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
    },
  });

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى إدخال رمز الصيانة",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("repair_codes")
        .select("*")
        .eq("code", searchCode.toUpperCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            variant: "destructive",
            title: "خطأ",
            description: "الكود غير موجود",
          });
          setSelectedCode(null);
          return;
        }
        throw error;
      }

      setSelectedCode(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
      setSelectedCode(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">استلام رمز الصيانة</h1>
          <p className="text-gray-600">أدخل رمز الصيانة للتحقق منه واستلامه</p>
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="code" className="sr-only">رمز الصيانة</Label>
                <Input
                  id="code"
                  placeholder="أدخل رمز الصيانة (مثال: ABC12345)"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                size="lg"
              >
                <Search className="h-5 w-5 ml-2" />
                بحث
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Code Details Section */}
        {selectedCode && (
          <Card className="shadow-lg">
            <CardHeader className={`${selectedCode.is_used ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">تفاصيل رمز الصيانة</CardTitle>
                <div className="flex items-center gap-2">
                  {selectedCode.is_used ? (
                    <>
                      <XCircle className="h-6 w-6 text-red-500" />
                      <span className="text-lg font-semibold text-red-600">مستعمل</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <span className="text-lg font-semibold text-green-600">متاح</span>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Code Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">رمز الصيانة</p>
                    <p className="text-2xl font-mono font-bold text-primary">
                      {selectedCode.code}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاريخ الإنشاء</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <p className="text-lg font-medium">
                        {formatDistanceToNow(new Date(selectedCode.created_at), {
                          addSuffix: true,
                          locale: ar,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-gray-600">السعر الأصلي</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    ₪{selectedCode.original_price}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-gray-600">السعر بعد الخصم</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    ₪{selectedCode.discounted_price}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">مقدار التوفير</p>
                <p className="text-3xl font-bold text-purple-600">
                  ₪{selectedCode.original_price - selectedCode.discounted_price}
                  <span className="text-lg mr-2">
                    ({Math.round(((selectedCode.original_price - selectedCode.discounted_price) / selectedCode.original_price) * 100)}%)
                  </span>
                </p>
              </div>

              {/* Customer Information (if used) */}
              {selectedCode.is_used && selectedCode.customer_name && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">معلومات العميل</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">الاسم</p>
                        <p className="text-lg font-medium">{selectedCode.customer_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">رقم الهاتف</p>
                        <p className="text-lg font-medium" dir="ltr">{selectedCode.customer_phone}</p>
                      </div>
                    </div>
                    {selectedCode.used_at && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">تاريخ الاستلام</p>
                          <p className="text-lg font-medium">
                            {formatDistanceToNow(new Date(selectedCode.used_at), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Redeem Form (if not used) */}
              {!selectedCode.is_used && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">استلام الرمز</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">اسم العميل</Label>
                      <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="أدخل اسم العميل"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">رقم الهاتف</Label>
                      <Input
                        id="customerPhone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="أدخل رقم الهاتف"
                        dir="ltr"
                      />
                    </div>
                    <Button
                      onClick={() => redeemMutation.mutate()}
                      disabled={redeemMutation.isPending || !customerName || !customerPhone}
                      className="w-full"
                      size="lg"
                    >
                      {redeemMutation.isPending ? "جاري الاستلام..." : "تأكيد الاستلام"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!selectedCode && !isSearching && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">ابحث عن رمز صيانة للبدء</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RepairCodeRedeemPage;
