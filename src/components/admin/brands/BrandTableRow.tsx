
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, GripVertical } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BrandTableRowProps {
  brand: {
    id: string;
    name: string;
    logo_url: string | null;
    type: string;
  };
  onEdit: (brand: any) => void;
  onDelete: (id: string) => void;
}

const BrandTableRow = ({ brand, onEdit, onDelete }: BrandTableRowProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: brand.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'device':
        return 'Device Only';
      case 'accessory':
        return 'Accessory Only';
      case 'both':
        return 'Device & Accessory';
      default:
        return type;
    }
  };

  return (
    <>
      <div 
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between p-4 border rounded-lg mb-2 bg-white"
      >
        <div className="flex items-center gap-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab hover:text-primary focus:outline-none"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          {brand.logo_url && (
            <img 
              src={brand.logo_url} 
              alt={brand.name} 
              className="w-10 h-10 object-contain"
            />
          )}
          <div>
            <h3 className="font-medium">{brand.name}</h3>
            <p className="text-sm text-gray-500">{getTypeDisplay(brand.type)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(brand)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the brand "{brand.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(brand.id);
                setShowDeleteConfirm(false);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BrandTableRow;
