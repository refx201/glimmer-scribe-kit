import { formatDate } from "@/lib/utils";

interface CustomerInfoProps {
  customerName: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  status: string;
  additionalDetails?: string;
  promoCode?: string | null;
  originalPrice?: number;
  totalPrice: number;
}

const CustomerInfo = ({ 
  customerName, 
  phoneNumber, 
  address, 
  createdAt, 
  status,
  additionalDetails,
  promoCode,
  originalPrice,
  totalPrice
}: CustomerInfoProps) => {
  // Extract color and device problem from additional details if present
  const selectedColor = additionalDetails?.match(/Selected Color: ([^,]+)/)?.[1] || 'N/A';
  const deviceProblem = additionalDetails?.match(/Device Problem: (.+)/)?.[1] || '';
  const additionalNotes = additionalDetails?.match(/Additional Notes: (.+)/)?.[1] || '';

  return (
    <div className="bg-secondary/20 p-4 rounded-lg space-y-3">
      <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Name:</span> {customerName}
        </p>
        <p className="text-sm">
          <span className="font-medium">Phone:</span> {phoneNumber}
        </p>
        <p className="text-sm">
          <span className="font-medium">Address:</span> {address}
        </p>
        <p className="text-sm">
          <span className="font-medium">Date:</span> {formatDate(createdAt)}
        </p>
        {deviceProblem && (
          <p className="text-sm">
            <span className="font-medium">Device Problem:</span> {deviceProblem}
          </p>
        )}
        {selectedColor !== 'N/A' && (
          <p className="text-sm">
            <span className="font-medium">Selected Color:</span> {selectedColor}
          </p>
        )}
        {additionalNotes && (
          <p className="text-sm">
            <span className="font-medium">Additional Notes:</span> {additionalNotes}
          </p>
        )}
        <div className="bg-primary/10 p-2 rounded-md space-y-1">
          {promoCode && (
            <>
              <p className="text-sm">
                <span className="font-medium">Promo Code:</span>{" "}
                <span className="text-primary-accent">{promoCode}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Original Price:</span>{" "}
                <span className="line-through">₪{originalPrice?.toLocaleString()}</span>
              </p>
            </>
          )}
          <p className="text-sm">
            <span className="font-medium">Total Price:</span>{" "}
            <span className="text-primary-accent font-semibold">₪{totalPrice.toLocaleString()}</span>
          </p>
        </div>
        <p className="text-sm">
          <span className="font-medium">Status:</span>{" "}
          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
            status === "completed"
              ? "bg-green-100 text-green-800"
              : status === "in_progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CustomerInfo;