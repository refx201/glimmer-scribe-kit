import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PackageItem } from "@/types/package";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PackageDialog from "./PackageDialog";

interface PackageListProps {
  onEdit?: (packageItem: PackageItem) => void;
}

const PackageList = ({ onEdit }: PackageListProps) => {
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: packages = [], isLoading, error } = useQuery({
    queryKey: ["admin-packages", search],
    queryFn: async () => {
      console.log("Fetching packages...");
      let query = supabase
        .from("packages" as any)
        .select("*");
      
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching packages:", error);
        throw error;
      }
      
      console.log("Fetched packages:", data);
      return data as unknown as PackageItem[];
    },
  });

  const handleEdit = (packageItem: PackageItem) => {
    if (onEdit) {
      onEdit(packageItem);
    } else {
      setEditingPackage(packageItem);
      setShowDialog(true);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this package?");
    if (!confirmed) return;
    
    const { error } = await supabase
      .from("packages" as any)
      .delete()
      .eq("id", id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete package: " + error.message,
        variant: "destructive",
      });
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
    toast({
      title: "Success",
      description: "Package deleted successfully",
    });
  };

  const onDialogClose = () => {
    setShowDialog(false);
    setEditingPackage(null);
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
    setShowDialog(false);
    setEditingPackage(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Packages</h2>
          {onEdit ? null : (
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Package
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{editingPackage ? "Edit Package" : "Create New Package"}</DialogTitle>
                  <DialogDescription>
                    {editingPackage ? "Update package details and products" : "Create a new package with multiple products"}
                  </DialogDescription>
                </DialogHeader>
                <PackageDialog 
                  packageData={editingPackage} 
                  onSuccess={onSuccess} 
                  onCancel={onDialogClose} 
                />
              </DialogContent>
            </Dialog>
          )}

      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex mb-4 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load packages. Please try again.
          </div>
        ) : packages?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No packages found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Original Price</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Hot Sale</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages?.map((packageItem) => (
                  <TableRow key={packageItem.id}>
                    <TableCell>
                      <img 
                        src={packageItem.image} 
                        alt={packageItem.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{packageItem.name}</TableCell>
                    <TableCell>₪{packageItem.original_price}</TableCell>
                    <TableCell>₪{packageItem.sale_price}</TableCell>
                    <TableCell>{packageItem.discount}%</TableCell>
                    <TableCell>{packageItem.is_hot_sale ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(packageItem)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(packageItem.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                        <Link to={`/package/${packageItem.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageList;
