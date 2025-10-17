import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RepairCodeDialog from "./RepairCodeDialog";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, ExternalLink } from "lucide-react";

const RepairCodeList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<any>(null);

  const { data: repairCodes, isLoading } = useQuery({
    queryKey: ["repair-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repair_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("repair_codes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Repair code deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["repair-codes"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (code: any) => {
    setEditingCode(code);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Repair Codes</h2>
        <div className="flex gap-2">
          <Link to="/repair-code">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Go to Repair Code Page
            </Button>
          </Link>
          <Button onClick={() => setIsDialogOpen(true)}>Generate New Code</Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Original Price</TableHead>
              <TableHead>Discounted Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repairCodes?.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-medium">{code.code}</TableCell>
                <TableCell>${code.original_price}</TableCell>
                <TableCell>${code.discounted_price}</TableCell>
                <TableCell>
                  {code.is_used ? (
                    <span className="text-red-500">Used</span>
                  ) : (
                    <span className="text-green-500">Available</span>
                  )}
                </TableCell>
                <TableCell>
                  {code.customer_name ? (
                    <div>
                      <div>{code.customer_name}</div>
                      <div className="text-sm text-gray-500">
                        {code.customer_phone}
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(code)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(code.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <RepairCodeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingCode={editingCode}
        onClose={() => {
          setEditingCode(null);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default RepairCodeList;