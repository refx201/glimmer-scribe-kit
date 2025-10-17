import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search-bar";

type SectionConfig = {
  sectionType: 'featured' | 'hot_sale';
  itemType: 'product' | 'package';
  title: string;
  maxItems: number;
};

const FeaturedProducts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('featured-products');
  const [searchQueries, setSearchQueries] = useState({
    'featured-products': '',
    'featured-packages': '',
    'hot-sale-products': '',
    'hot-sale-packages': '',
  });

  const sections: Record<string, SectionConfig> = {
    'featured-products': { sectionType: 'featured', itemType: 'product', title: 'المنتجات المميزة', maxItems: 4 },
    'featured-packages': { sectionType: 'featured', itemType: 'package', title: 'الباقات المميزة', maxItems: 3 },
    'hot-sale-products': { sectionType: 'hot_sale', itemType: 'product', title: 'عروض البرق - المنتجات', maxItems: 4 },
    'hot-sale-packages': { sectionType: 'hot_sale', itemType: 'package', title: 'عروض البرق - الباقات', maxItems: 3 },
  };

  const currentSection = sections[activeTab];

  const { data: selectedItems, isLoading, refetch } = useQuery({
    queryKey: ["featured-items", currentSection.sectionType, currentSection.itemType],
    queryFn: async () => {
      const tableName = currentSection.itemType === 'product' ? 'products' : 'packages';
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq(currentSection.sectionType === 'featured' ? 'is_featured' : 'is_hot_sale', true)
        .not('featured_order', 'is', null)
        .order('featured_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: availableItems } = useQuery({
    queryKey: ["available-items", currentSection.sectionType, currentSection.itemType],
    queryFn: async () => {
      const tableName = currentSection.itemType === 'product' ? 'products' : 'packages';
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .or(`${currentSection.sectionType === 'featured' ? 'is_featured' : 'is_hot_sale'}.is.null,${currentSection.sectionType === 'featured' ? 'is_featured' : 'is_hot_sale'}.eq.false`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const filteredSelectedItems = selectedItems?.filter(item =>
    item.name.toLowerCase().includes(searchQueries[activeTab].toLowerCase())
  ) || [];

  const filteredAvailableItems = availableItems?.filter(item =>
    item.name.toLowerCase().includes(searchQueries[activeTab].toLowerCase())
  ) || [];

  const handleAddToSection = async (id: string) => {
    const currentCount = selectedItems?.length || 0;
    if (currentCount >= currentSection.maxItems) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: `يمكنك فقط اختيار ${currentSection.maxItems} عناصر كحد أقصى`,
      });
      return;
    }

    try {
      const updates = {
        [currentSection.sectionType === 'featured' ? 'is_featured' : 'is_hot_sale']: true,
        featured_order: currentCount + 1
      };

      const tableName = currentSection.itemType === 'product' ? 'products' : 'packages';
      const { error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "نجح",
        description: "تمت إضافة العنصر بنجاح",
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
    }
  };

  const handleRemoveFromSection = async (id: string) => {
    try {
      const itemToRemove = selectedItems?.find(p => p.id === id);
      if (!itemToRemove) return;

      const currentOrder = itemToRemove.featured_order;
      const tableName = currentSection.itemType === 'product' ? 'products' : 'packages';

      const { error: removeError } = await supabase
        .from(tableName)
        .update({
          [currentSection.sectionType === 'featured' ? 'is_featured' : 'is_hot_sale']: null,
          featured_order: null
        })
        .eq('id', id);

      if (removeError) throw removeError;

      const remainingItems = selectedItems?.filter(p => 
        p.id !== id && 
        p.featured_order > currentOrder
      ) || [];

      for (const item of remainingItems) {
        const { error: updateError } = await supabase
          .from(tableName)
          .update({
            featured_order: item.featured_order - 1
          })
          .eq('id', item.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "نجح",
        description: "تمت إزالة العنصر بنجاح",
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة العناصر المميزة والعروض</CardTitle>
          <CardDescription>اختر العناصر التي تريد تثبيتها وعرضها أولاً على الصفحة الرئيسية</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="featured-products" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="featured-products">
                📱 المنتجات المميزة
              </TabsTrigger>
              <TabsTrigger value="featured-packages">
                📦 الباقات المميزة
              </TabsTrigger>
              <TabsTrigger value="hot-sale-products">
                🔥 عروض المنتجات
              </TabsTrigger>
              <TabsTrigger value="hot-sale-packages">
                🔥 عروض الباقات
              </TabsTrigger>
            </TabsList>

            {Object.keys(sections).map((tabKey) => (
              <TabsContent key={tabKey} value={tabKey} className="space-y-4">
                <SearchBar
                  value={searchQueries[tabKey]}
                  onChange={(value) => setSearchQueries({ ...searchQueries, [tabKey]: value })}
                  placeholder="ابحث عن منتج أو باقة..."
                  className="mb-4"
                />
                <ItemsSection
                  title={sections[tabKey].title}
                  selectedItems={filteredSelectedItems}
                  availableItems={filteredAvailableItems}
                  onAdd={handleAddToSection}
                  onRemove={handleRemoveFromSection}
                  isLoading={isLoading}
                  maxItems={sections[tabKey].maxItems}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface ItemsSectionProps {
  title: string;
  selectedItems: any[];
  availableItems: any[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  isLoading: boolean;
  maxItems: number;
}

const ItemsSection = ({ title, selectedItems, availableItems, onAdd, onRemove, isLoading, maxItems }: ItemsSectionProps) => {
  return (
    <>
      <div className="bg-background rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-4">{title} - المثبتة (الحد الأقصى {maxItems})</h3>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
        ) : selectedItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">لا توجد عناصر مختارة</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الصورة</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.featured_order}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemove(item.id)}
                    >
                      إزالة
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="bg-background rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-4">العناصر المتاحة</h3>
        {availableItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">لا توجد عناصر متاحة</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الصورة</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAdd(item.id)}
                      disabled={selectedItems.length >= maxItems}
                    >
                      تثبيت
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default FeaturedProducts;
