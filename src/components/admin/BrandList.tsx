
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useBrands } from "@/hooks/useBrands";
import BrandDialog from "./brands/BrandDialog";
import BrandTableRow from "./brands/BrandTableRow";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface LocalBrand {
  id: string;
  name: string;
  logo_url: string;
  type: string;
  display_order: number;
  is_active: boolean;
  order_index: number;
}

const BrandList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<LocalBrand | null>(null);
  const { brands, addBrand, updateBrand, deleteBrand, reorderBrands, isLoading } = useBrands();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSubmit = async (brand: LocalBrand) => {
    const result = selectedBrand
      ? await updateBrand({ 
          ...brand, 
          id: selectedBrand.id,
          is_active: brand.is_active,
          order_index: brand.order_index
        })
      : await addBrand({
          name: brand.name,
          logo_url: brand.logo_url,
          order_index: brand.order_index,
          is_active: brand.is_active
        });

    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });

    if (result.success) {
      setIsDialogOpen(false);
      setSelectedBrand(null);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteBrand(id);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = brands.findIndex(brand => brand.id === active.id);
    const newIndex = brands.findIndex(brand => brand.id === over.id);
    
    const reorderedBrands = [...brands];
    const [removed] = reorderedBrands.splice(oldIndex, 1);
    reorderedBrands.splice(newIndex, 0, removed);
    
    // Update display_order for all affected brands
    const updatedBrands = reorderedBrands.map((brand, index) => ({
      ...brand,
      display_order: index + 1
    }));

    const result = await reorderBrands(updatedBrands);
    
    if (!result.success) {
      toast({
        title: "Error",
        description: "Failed to reorder brands",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Brands</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Brand
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={brands?.map(brand => brand.id) || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {brands?.map((brand) => (
              <BrandTableRow
                key={brand.id}
                brand={brand}
                onEdit={() => setSelectedBrand(brand)}
                onDelete={() => handleDelete(brand.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <BrandDialog
        open={isDialogOpen || !!selectedBrand}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedBrand(null);
        }}
        brand={selectedBrand}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BrandList;
