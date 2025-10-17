import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const JoinRequestList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: requests, isLoading } = useQuery({
    queryKey: ["join-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("join_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("join_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Join request deleted successfully",
      });

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ["join-requests"] });
    } catch (error) {
      console.error("Error deleting join request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete join request",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Join Requests</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Help Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.full_name}</TableCell>
              <TableCell>{request.phone_number}</TableCell>
              <TableCell className="max-w-[200px] truncate">{request.experience}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {request.help_description}
              </TableCell>
              <TableCell>
                {new Date(request.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(request.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JoinRequestList;