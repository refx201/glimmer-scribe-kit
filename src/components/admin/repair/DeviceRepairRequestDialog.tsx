
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface RepairRequestDialogProps {
  request: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeviceRepairRequestDialog = ({
  request,
  open,
  onOpenChange,
}: RepairRequestDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [estimatedCost, setEstimatedCost] = useState(request.estimated_cost || 0);
  const [notes, setNotes] = useState(request.notes || "");
  const [activeTab, setActiveTab] = useState("details");

  const updateRequest = useMutation({
    mutationFn: async ({ 
      status, 
      estimated_cost,
      notes
    }: { 
      status?: string; 
      estimated_cost?: number;
      notes?: string;
    }) => {
      const updates: Record<string, any> = {};
      
      if (status) updates.status = status;
      if (estimated_cost !== undefined) updates.estimated_cost = estimated_cost;
      if (notes !== undefined) updates.notes = notes;
      
      const { data, error } = await supabase
        .from("device_repair_requests")
        .update(updates)
        .eq("id", request.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-repair-requests"] });
      toast({
        title: "Success",
        description: "Repair request updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update repair request",
      });
    },
  });

  const deleteRequest = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("device_repair_requests")
        .delete()
        .eq("id", request.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-repair-requests"] });
      toast({
        title: "Success",
        description: "Repair request deleted successfully",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete repair request",
      });
    },
  });

  const handleUpdateStatus = (status: string) => {
    updateRequest.mutate({ status });
  };

  const handleUpdateCost = () => {
    updateRequest.mutate({ estimated_cost: Number(estimatedCost) });
  };

  const handleUpdateNotes = () => {
    updateRequest.mutate({ notes });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this repair request?")) {
      deleteRequest.mutate();
    }
  };

  const formatAddress = () => {
    if (request.city && request.village) {
      return `${request.city} - ${request.village}`;
    }
    return request.city || 'Not provided';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            Device Repair Request Details
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="details">Customer Details</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Customer:</span>{" "}
                {request.customer_name}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {request.phone_number}
              </div>
              <div>
                <span className="font-semibold">Address:</span>{" "}
                {formatAddress()}
              </div>
              <div>
                <span className="font-semibold">Device Type:</span>{" "}
                {request.device_type}
              </div>
              <div>
                <span className="font-semibold">Issue:</span>{" "}
                <p className="mt-1 text-gray-600">{request.issue_description}</p>
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    request.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : request.status === "in_progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {request.status}
                </span>
              </div>
              <div>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(request.created_at).toLocaleString()}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Change Status</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={request.status === "pending" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus("pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={request.status === "in_progress" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus("in_progress")}
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant={request.status === "completed" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus("completed")}
                  >
                    Completed
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estimated Cost (₪)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  />
                  <Button onClick={handleUpdateCost}>Update</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes here"
                  className="min-h-[100px]"
                />
                <Button onClick={handleUpdateNotes} className="w-full">
                  Save Notes
                </Button>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
              >
                Delete Request
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceRepairRequestDialog;