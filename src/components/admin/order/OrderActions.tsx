import { Button } from "@/components/ui/button";
import { Check, Trash2, PlayCircle } from "lucide-react";

interface OrderActionsProps {
  status: string;
  onUpdateStatus: (status: 'pending' | 'in_progress' | 'completed') => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const OrderActions = ({ 
  status, 
  onUpdateStatus, 
  onDelete, 
  isUpdating, 
  isDeleting 
}: OrderActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      {status === "pending" && (
        <Button
          className="flex-1 bg-blue-500 hover:bg-blue-600"
          onClick={() => onUpdateStatus("in_progress")}
          disabled={isUpdating}
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          {isUpdating ? "Starting..." : "Start"}
        </Button>
      )}
      {status === "in_progress" && (
        <Button
          className="flex-1 bg-green-500 hover:bg-green-600"
          onClick={() => onUpdateStatus("completed")}
          disabled={isUpdating}
        >
          <Check className="mr-2 h-4 w-4" />
          {isUpdating ? "Completing..." : "Complete"}
        </Button>
      )}
      <Button
        variant="destructive"
        className="flex-1"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};

export default OrderActions;