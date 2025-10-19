import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Coins } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function UserPointsBadge() {
  const { user } = useAuth();

  const { data: points } = useQuery({
    queryKey: ["user-points", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_points")
        .select("points")
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        // If no points record exists, return 0
        if (error.code === 'PGRST116') return { points: 0 };
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors cursor-pointer">
          <Coins className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-700">
            {points?.points || 0}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-60" align="end">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <h4 className="font-semibold">نقاطك</h4>
          </div>
          <p className="text-sm text-muted-foreground text-right">
            لديك حالياً <span className="font-bold text-yellow-600">{points?.points || 0}</span> نقطة
          </p>
          <p className="text-xs text-muted-foreground text-right">
            استخدم نقاطك للحصول على خصومات وعروض حصرية!
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
