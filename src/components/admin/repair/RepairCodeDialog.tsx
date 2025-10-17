import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface RepairCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCode?: any;
  onClose: () => void;
}

const RepairCodeDialog = ({
  open,
  onOpenChange,
  editingCode,
  onClose,
}: RepairCodeDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    original_price: "",
    discounted_price: "",
  });

  useEffect(() => {
    if (editingCode) {
      setFormData({
        original_price: editingCode.original_price.toString(),
        discounted_price: editingCode.discounted_price.toString(),
      });
    } else {
      setFormData({
        original_price: "",
        discounted_price: "",
      });
    }
  }, [editingCode]);

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        original_price: parseInt(formData.original_price),
        discounted_price: parseInt(formData.discounted_price),
      };

      if (editingCode) {
        const { error } = await supabase
          .from("repair_codes")
          .update({
            ...data,
            id: editingCode.id // Include the id field for the update
          })
          .eq("id", editingCode.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Repair code updated successfully",
        });
      } else {
        // Generate a UUID for the new repair code
        const newId = crypto.randomUUID();
        
        const { error } = await supabase
          .from("repair_codes")
          .insert({
            id: newId,
            code: generateRandomCode(),
            ...data,
            is_used: false
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Repair code generated successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["repair-codes"] });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCode ? "Edit Repair Code" : "Generate New Repair Code"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original_price">Original Price</Label>
            <Input
              id="original_price"
              type="number"
              value={formData.original_price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  original_price: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discounted_price">Discounted Price</Label>
            <Input
              id="discounted_price"
              type="number"
              value={formData.discounted_price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discounted_price: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? editingCode
                  ? "Updating..."
                  : "Generating..."
                : editingCode
                ? "Update"
                : "Generate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RepairCodeDialog;