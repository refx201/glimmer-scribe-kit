import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Star, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  product_id: string;
  reviewer_name: string | null;
  helpful_count: number;
  products?: {
    name: string;
  };
  profiles?: {
    display_name: string | null;
    full_name: string | null;
    email: string | null;
  };
}

export function ReviewsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data: baseReviews, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .returns<Review[]>();

      if (error) throw error;
      const base = (baseReviews ?? []) as Review[];

      // Collect IDs to hydrate product and user info
      const productIds = Array.from(new Set(base.map(r => r.product_id).filter(Boolean)));
      const userIds = Array.from(new Set(base.map(r => r.user_id).filter(Boolean)));

      let productMap: Record<string, { name: string }> = {};
      let profileMap: Record<string, { display_name: string | null; full_name: string | null; email: string | null }> = {};

      if (productIds.length > 0) {
        const { data: productsData } = await (supabase as any)
          .from("products")
          .select("id, name")
          .in("id", productIds as any);

        productsData?.forEach((p: any) => {
          productMap[p.id] = { name: p.name };
        });
      }

      if (userIds.length > 0) {
        const { data: profilesData } = await (supabase as any)
          .from("profiles")
          .select("id, display_name, full_name, email")
          .in("id", userIds as any);

        profilesData?.forEach((p: any) => {
          profileMap[p.id] = { display_name: p.display_name, full_name: p.full_name, email: p.email };
        });
      }

      // Enrich base reviews with product and profile info expected by the UI
      const enriched = base.map(r => ({
        ...r,
        products: productMap[r.product_id] ? { name: productMap[r.product_id].name } : undefined,
        profiles: profileMap[r.user_id] || undefined,
      }));

      return enriched as Review[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await (supabase as any)
        .from("reviews")
        .delete()
        .eq("id", reviewId as any);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      setSelectedReview(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    },
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getUserName = (review: Review) => {
    return (
      review.profiles?.display_name ||
      review.profiles?.full_name ||
      review.reviewer_name ||
      "مستخدم مجهول"
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No reviews found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Reviews Management ({reviews.length} total)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Helpful</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">
                  {review.products?.name || "Unknown Product"}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{getUserName(review)}</div>
                    {review.profiles?.email && (
                      <div className="text-xs text-gray-500">
                        {review.profiles.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{renderStars(review.rating)}</TableCell>
                <TableCell className="max-w-md">
                  {review.comment ? (
                    <p className="line-clamp-2 text-sm">{review.comment}</p>
                  ) : (
                    <span className="text-gray-400 text-sm italic">
                      No comment
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{review.helpful_count || 0}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog
                    open={selectedReview === review.id}
                    onOpenChange={(open) =>
                      setSelectedReview(open ? review.id : null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this review? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(review.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
