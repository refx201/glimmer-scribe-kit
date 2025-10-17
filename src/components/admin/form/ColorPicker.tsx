
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

interface ColorPickerProps {
  selectedColors: string[];
  onColorSelect: (colors: string[]) => void;
}

export const ColorPicker = ({ selectedColors, onColorSelect }: ColorPickerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddColor, setShowAddColor] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("");

  const { data: colors, isLoading } = useQuery({
    queryKey: ["custom-colors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_colors")
        .select("hex, display_name, name")
        .order('display_name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddColor = async () => {
    if (!newColorName.trim() || !newColorHex.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in both name and hex color",
      });
      return;
    }

    try {
      const colorData = {
        name: newColorName.toLowerCase().replace(/\s+/g, '-').trim(),
        display_name: newColorName.trim(),
        hex: newColorHex.trim()
      };

      const { error } = await supabase
        .from("custom_colors")
        .insert([colorData]);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["custom-colors"] });

      toast({
        title: "Success",
        description: "Color added successfully",
      });

      setNewColorName("");
      setNewColorHex("");
      setShowAddColor(false);
    } catch (error) {
      console.error("Error adding color:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add color. Please try again.",
      });
    }
  };

  const toggleColor = (colorHex: string) => {
    console.log("Selected colors before:", selectedColors);
    console.log("Toggling color hex:", colorHex);
    
    const newColors = selectedColors.includes(colorHex)
      ? selectedColors.filter(color => color !== colorHex)
      : [...selectedColors, colorHex];
    
    console.log("Selected colors after:", newColors);
    onColorSelect(newColors);
  };

  if (isLoading) {
    return <div>Loading colors...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Available Colors</label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddColor(!showAddColor)}
          className="text-xs"
        >
          {showAddColor ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add Color
            </>
          )}
        </Button>
      </div>

      {showAddColor && (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Color Name</label>
            <Input
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="e.g. Navy Blue"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hex Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-20"
              />
              <Input
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          <Button onClick={handleAddColor} className="w-full">
            Add Color
          </Button>
        </div>
      )}

      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="grid grid-cols-4 gap-2">
          {colors?.map((color) => (
            <Button
              key={color.hex}
              variant="outline"
              className={`h-12 relative ${
                selectedColors.includes(color.hex)
                  ? "ring-2 ring-primary"
                  : ""
              }`}
              onClick={() => toggleColor(color.hex)}
            >
              <span
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color.hex }}
              />
              <span className="ml-2 text-xs">{color.display_name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
