
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeviceRepairRequestDialog from "./DeviceRepairRequestDialog";

const DeviceRepairRequestsSection = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ["device-repair-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_repair_requests")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleSelectRequest = (requestId: string, checked: boolean) => {
    const newSelection = new Set(selectedRequests);
    if (checked) {
      newSelection.add(requestId);
    } else {
      newSelection.delete(requestId);
    }
    setSelectedRequests(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = requests?.map(req => req.id) || [];
      setSelectedRequests(new Set(allIds));
    } else {
      setSelectedRequests(new Set());
    }
  };

  const handleBulkDelete = async () => {
    try {
      console.log("Deleting repair requests:", Array.from(selectedRequests));
      
      if (selectedRequests.size === 0) {
        toast({
          title: "Error",
          description: "No repair requests selected for deletion.",
          variant: "destructive",
        });
        return;
      }

      const { error, data } = await supabase
        .from("device_repair_requests")
        .delete()
        .in("id", Array.from(selectedRequests))
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Deleted requests:", data);

      toast({
        title: "Success",
        description: `Deleted ${selectedRequests.size} repair requests successfully.`,
      });

      setSelectedRequests(new Set());
      
      // Force refresh with a slight delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["device-repair-requests"] });
        queryClient.refetchQueries({ queryKey: ["device-repair-requests"] });
      }, 500);
      
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast({
        title: "Error", 
        description: "Failed to delete repair requests. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 flex items-center justify-center h-64 text-red-500">
        Error loading repair requests. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Bulk Actions */}
      {requests && requests.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 items-center bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1">
              <Checkbox
                checked={selectedRequests.size > 0 && selectedRequests.size === requests.length}
                onCheckedChange={handleSelectAll}
                className="h-5 w-5"
              />
              <span className="text-sm font-medium select-none">
                Select all
              </span>
            </div>
            {selectedRequests.size > 0 && (
              <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium">
                {selectedRequests.size} {selectedRequests.size === 1 ? 'request' : 'requests'} selected
              </div>
            )}
          </div>
          
          {selectedRequests.size > 0 && (
            <div className="flex gap-2 ml-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedRequests.size} selected repair requests? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center"></TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>العميل</TableHead>
            <TableHead>رقم الهاتف</TableHead>
            <TableHead>نوع الجهاز</TableHead>
            <TableHead>المشكلة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التكلفة المقدرة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request) => (
            <TableRow 
              key={request.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest('.checkbox-cell')) {
                  setSelectedRequest(request);
                }
              }}
            >
              <TableCell className="checkbox-cell">
                <div className="flex items-center justify-center p-2">
                  <Checkbox
                    checked={selectedRequests.has(request.id)}
                    onCheckedChange={(checked) => handleSelectRequest(request.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5"
                  />
                </div>
              </TableCell>
              <TableCell>{new Date(request.created_at).toLocaleString()}</TableCell>
              <TableCell>{request.customer_name}</TableCell>
              <TableCell>{request.phone_number}</TableCell>
              <TableCell>{request.device_type}</TableCell>
              <TableCell className="max-w-xs truncate">
                {request.issue_description}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    request.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : request.status === "in_progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {request.status === "completed" ? "مكتمل" 
                    : request.status === "in_progress" ? "قيد التنفيذ"
                    : "قيد الانتظار"}
                </span>
              </TableCell>
              <TableCell>
                {request.estimated_cost 
                  ? `₪${request.estimated_cost.toLocaleString()}`
                  : 'Not set'
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedRequest && (
        <DeviceRepairRequestDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default DeviceRepairRequestsSection;
