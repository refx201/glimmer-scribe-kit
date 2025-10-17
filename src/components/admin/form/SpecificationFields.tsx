import React from "react";
import { Json } from "@/integrations/supabase/types";

interface SpecificationsSectionProps {
  specifications: {
    description?: string;
    details?: Record<string, string>;
  } | string;
}

const SpecificationsSection = ({ specifications }: SpecificationsSectionProps) => {
  console.log("Specifications received:", specifications);

  if (!specifications) {
    console.log("No specifications provided");
    return null;
  }

  // Handle both string descriptions and descriptions within objects
  const description = typeof specifications === 'string' 
    ? specifications 
    : specifications.description;

  if (!description) {
    console.log("No description found in specifications");
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="prose prose-sm max-w-none">
        <h4 className="text-lg font-semibold mb-4 text-right">المواصفات</h4>
        <p className="text-gray-600 whitespace-pre-wrap text-right" dir="rtl">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SpecificationsSection;