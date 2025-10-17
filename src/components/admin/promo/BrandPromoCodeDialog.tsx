import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandDiscount {
  brand_id: string;
  brand_name: string;
  discount_percentage: string;
  profit_percentage: string;
}

interface PackageDiscount {
  package_id: string;
  package_name: string;
  discount_percentage: string;
  profit_percentage: string;
}

interface BrandPromoCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPromoCode?: any;
}

const BrandPromoCodeDialog = ({
  open,
  onOpenChange,
  editingPromoCode,
}: BrandPromoCodeDialogProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [brandDiscounts, setBrandDiscounts] = useState<BrandDiscount[]>([]);
  const [packageDiscounts, setPackageDiscounts] = useState<PackageDiscount[]>([]);

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Load existing promo code data
  useEffect(() => {
    if (editingPromoCode && open) {
      setCode(editingPromoCode.code);
      setIsActive(editingPromoCode.is_active);
      
      // Load brand discounts
      const loadBrandDiscounts = async () => {
        const { data, error } = await supabase
          .from("promo_code_brand_discounts")
          .select(`
            *,
            brands (name)
          `)
          .eq("promo_code_id", editingPromoCode.id);
        
        if (!error && data) {
          setBrandDiscounts(
            data.map((d: any) => ({
              brand_id: d.brand_id,
              brand_name: d.brands?.name || '',
              discount_percentage: d.discount_percentage.toString(),
              profit_percentage: d.profit_percentage.toString(),
            }))
          );
        }
      };
      
      // Load package discounts
      const loadPackageDiscounts = async () => {
        const { data, error } = await supabase
          .from("promo_code_package_discounts")
          .select(`
            *,
            packages (name)
          `)
          .eq("promo_code_id", editingPromoCode.id);
        
        if (!error && data) {
          setPackageDiscounts(
            data.map((d: any) => ({
              package_id: d.package_id,
              package_name: d.packages?.name || '',
              discount_percentage: d.discount_percentage.toString(),
              profit_percentage: d.profit_percentage.toString(),
            }))
          );
        }
      };
      
      loadBrandDiscounts();
      loadPackageDiscounts();
    } else {
      // Reset for new promo code
      setCode("");
      setIsActive(true);
      setBrandDiscounts([]);
      setPackageDiscounts([]);
    }
  }, [editingPromoCode, open]);

  const addBrandDiscount = () => {
    if (!brands || brands.length === 0) return;
    
    // Find first brand not already added
    const unusedBrand = brands.find(
      b => !brandDiscounts.some(bd => bd.brand_id === b.id)
    );
    
    if (unusedBrand) {
      setBrandDiscounts([...brandDiscounts, {
        brand_id: unusedBrand.id,
        brand_name: unusedBrand.name,
        discount_percentage: "",
        profit_percentage: "",
      }]);
    }
  };

  const removeBrandDiscount = (index: number) => {
    setBrandDiscounts(brandDiscounts.filter((_, i) => i !== index));
  };

  const updateBrandDiscount = (index: number, field: string, value: string) => {
    const updated = [...brandDiscounts];
    updated[index] = { ...updated[index], [field]: value };
    setBrandDiscounts(updated);
  };

  const addPackageDiscount = () => {
    if (!packages || packages.length === 0) return;
    
    // Find first package not already added
    const unusedPackage = packages.find(
      p => !packageDiscounts.some(pd => pd.package_id === p.id)
    );
    
    if (unusedPackage) {
      setPackageDiscounts([...packageDiscounts, {
        package_id: unusedPackage.id,
        package_name: unusedPackage.name,
        discount_percentage: "",
        profit_percentage: "",
      }]);
    }
  };

  const removePackageDiscount = (index: number) => {
    setPackageDiscounts(packageDiscounts.filter((_, i) => i !== index));
  };

  const updatePackageDiscount = (index: number, field: string, value: string) => {
    const updated = [...packageDiscounts];
    updated[index] = { ...updated[index], [field]: value };
    setPackageDiscounts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast.error("الرجاء إدخال رمز الكوبون");
      return;
    }

    if (brandDiscounts.length === 0 && packageDiscounts.length === 0) {
      toast.error("الرجاء إضافة خصم لعلامة تجارية أو باقة واحدة على الأقل");
      return;
    }

    // Validate all brand discounts
    for (const bd of brandDiscounts) {
      const discount = parseFloat(bd.discount_percentage);
      const profit = parseFloat(bd.profit_percentage);
      
      if (isNaN(discount) || discount <= 0 || discount > 100) {
        toast.error(`نسبة الخصم يجب أن تكون بين 1 و 100 للعلامة التجارية ${bd.brand_name}`);
        return;
      }
      
      if (isNaN(profit) || profit < 0 || profit > 100) {
        toast.error(`نسبة الربح يجب أن تكون بين 0 و 100 للعلامة التجارية ${bd.brand_name}`);
        return;
      }
    }

    // Validate all package discounts
    for (const pd of packageDiscounts) {
      const discount = parseFloat(pd.discount_percentage);
      const profit = parseFloat(pd.profit_percentage);
      
      if (isNaN(discount) || discount <= 0 || discount > 100) {
        toast.error(`نسبة الخصم يجب أن تكون بين 1 و 100 للباقة ${pd.package_name}`);
        return;
      }
      
      if (isNaN(profit) || profit < 0 || profit > 100) {
        toast.error(`نسبة الربح يجب أن تكون بين 0 و 100 للباقة ${pd.package_name}`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let promoCodeId = editingPromoCode?.id;

      if (editingPromoCode) {
        // Update existing promo code
        const { error: updateError } = await supabase
          .from("promo_codes")
          .update({
            is_active: isActive,
          })
          .eq("id", editingPromoCode.id);

        if (updateError) throw updateError;

        // Delete existing brand and package discounts
        await supabase
          .from("promo_code_brand_discounts")
          .delete()
          .eq("promo_code_id", editingPromoCode.id);
        
        await supabase
          .from("promo_code_package_discounts")
          .delete()
          .eq("promo_code_id", editingPromoCode.id);
      } else {
        // Create new promo code (without discount_percentage and profit_percentage)
        console.log('Creating promo code with code:', code.toUpperCase());
        
        const { data: newPromo, error: insertError } = await supabase
          .from("promo_codes")
          .insert({
            code: code.toUpperCase(),
            discount_percentage: 0, // Placeholder, not used for brand-specific
            profit_percentage: 0, // Placeholder, not used for brand-specific
            is_active: isActive,
          })
          .select()
          .maybeSingle();

        console.log('Insert result:', { newPromo, insertError });

        if (insertError) {
          console.error('Insert error details:', insertError);
          if (insertError.code === "23505") {
            toast.error("هذا الرمز موجود بالفعل");
            return;
          }
          throw insertError;
        }

        if (!newPromo) {
          throw new Error("Failed to create promo code - no data returned");
        }

        promoCodeId = newPromo.id;
        console.log('Created promo code with ID:', promoCodeId);
      }

      // Insert brand discounts
      console.log('Inserting brand discounts:', brandDiscounts);
      
      const brandDiscountInserts = brandDiscounts.map(bd => ({
        promo_code_id: promoCodeId,
        brand_id: bd.brand_id,
        discount_percentage: parseFloat(bd.discount_percentage),
        profit_percentage: parseFloat(bd.profit_percentage),
      }));

      console.log('Brand discount inserts prepared:', brandDiscountInserts);

      if (brandDiscountInserts.length > 0) {
        const { error: discountError } = await supabase
          .from("promo_code_brand_discounts")
          .insert(brandDiscountInserts);

        console.log('Brand discount insert result:', { discountError });

        if (discountError) {
          console.error('Discount error details:', discountError);
          throw discountError;
        }
      }

      // Insert package discounts
      console.log('Inserting package discounts:', packageDiscounts);
      
      const packageDiscountInserts = packageDiscounts.map(pd => ({
        promo_code_id: promoCodeId,
        package_id: pd.package_id,
        discount_percentage: parseFloat(pd.discount_percentage),
        profit_percentage: parseFloat(pd.profit_percentage),
      }));

      console.log('Package discount inserts prepared:', packageDiscountInserts);

      if (packageDiscountInserts.length > 0) {
        const { error: packageDiscountError } = await supabase
          .from("promo_code_package_discounts")
          .insert(packageDiscountInserts);

        console.log('Package discount insert result:', { packageDiscountError });

        if (packageDiscountError) {
          console.error('Package discount error details:', packageDiscountError);
          throw packageDiscountError;
        }
      }

      toast.success(editingPromoCode ? "تم تحديث الكوبون بنجاح!" : "تم إنشاء الكوبون بنجاح!");
      await queryClient.invalidateQueries({ queryKey: ["admin-promo-codes"] });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving promo code:", error);
      
      // Better error messages
      let errorMessage = "فشل حفظ الكوبون";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === "23503") {
        errorMessage = "خطأ: علامة تجارية غير موجودة";
      } else if (error.code === "23505") {
        errorMessage = "خطأ: هذا الكوبون موجود بالفعل لهذه العلامة التجارية";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingPromoCode ? "تعديل كوبون الخصم" : "إنشاء كوبون خصم جديد"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-right block">
              رمز الكوبون
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="REFAAT"
              disabled={!!editingPromoCode}
              className="uppercase text-right"
              dir="rtl"
            />
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Label htmlFor="is_active">نشط</Label>
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>

          <Tabs defaultValue="brands" dir="rtl" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="brands">العلامات التجارية</TabsTrigger>
              <TabsTrigger value="packages">الباقات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="brands" className="space-y-3">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBrandDiscount}
                  disabled={!brands || brandDiscounts.length >= (brands?.length || 0)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة علامة تجارية
                </Button>
                <Label className="text-right">خصومات العلامات التجارية</Label>
              </div>

              {brandDiscounts.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                  لا توجد علامات تجارية. اضغط "إضافة علامة تجارية" للبدء
                </Card>
              ) : (
                <div className="space-y-3">
                  {brandDiscounts.map((bd, index) => (
                    <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBrandDiscount(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="space-y-1">
                          <Label className="text-right block">العلامة التجارية</Label>
                          <select
                            value={bd.brand_id}
                            onChange={(e) => {
                              const brand = brands?.find(b => b.id === e.target.value);
                              if (brand) {
                                updateBrandDiscount(index, 'brand_id', brand.id);
                                updateBrandDiscount(index, 'brand_name', brand.name);
                              }
                            }}
                            className="w-full p-2 border rounded-md text-right"
                            dir="rtl"
                          >
                            {brands?.map(brand => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-right block text-sm">
                            نسبة الخصم (%)
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={bd.discount_percentage}
                            onChange={(e) => updateBrandDiscount(index, 'discount_percentage', e.target.value)}
                            placeholder="10"
                            className="text-right"
                            dir="rtl"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-right block text-sm">
                            نسبة الربح (%)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={bd.profit_percentage}
                            onChange={(e) => updateBrandDiscount(index, 'profit_percentage', e.target.value)}
                            placeholder="5"
                            className="text-right"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            </TabsContent>

            <TabsContent value="packages" className="space-y-3">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPackageDiscount}
                  disabled={!packages || packageDiscounts.length >= (packages?.length || 0)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة باقة
                </Button>
                <Label className="text-right">خصومات الباقات</Label>
              </div>

              {packageDiscounts.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                  لا توجد باقات. اضغط "إضافة باقة" للبدء
                </Card>
              ) : (
                <div className="space-y-3">
                  {packageDiscounts.map((pd, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePackageDiscount(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="space-y-1">
                            <Label className="text-right block">الباقة</Label>
                            <select
                              value={pd.package_id}
                              onChange={(e) => {
                                const pkg = packages?.find(p => p.id === e.target.value);
                                if (pkg) {
                                  updatePackageDiscount(index, 'package_id', pkg.id);
                                  updatePackageDiscount(index, 'package_name', pkg.name);
                                }
                              }}
                              className="w-full p-2 border rounded-md text-right"
                              dir="rtl"
                            >
                              {packages?.map(pkg => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-right block text-sm">
                              نسبة الخصم (%)
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              value={pd.discount_percentage}
                              onChange={(e) => updatePackageDiscount(index, 'discount_percentage', e.target.value)}
                              placeholder="10"
                              className="text-right"
                              dir="rtl"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-right block text-sm">
                              نسبة الربح (%)
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={pd.profit_percentage}
                              onChange={(e) => updatePackageDiscount(index, 'profit_percentage', e.target.value)}
                              placeholder="5"
                              className="text-right"
                              dir="rtl"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (editingPromoCode ? "جاري التحديث..." : "جاري الإنشاء...")
                : (editingPromoCode ? "تحديث" : "إنشاء")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BrandPromoCodeDialog;
