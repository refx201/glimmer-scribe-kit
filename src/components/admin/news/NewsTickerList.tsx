import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NewsTickerDialog from "./NewsTickerDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const NewsTickerList = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: newsItems = [], isLoading } = useQuery({
    queryKey: ["news-ticker-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_ticker_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("news_ticker_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "News item deleted successfully!",
      });

      queryClient.invalidateQueries({ queryKey: ["news-ticker-items"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete news item",
      });
    }
  };

  const handleEdit = (news: any) => {
    setEditingNews(news);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingNews(null);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading news items...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">الأخبار المضافه</h2>
        <Button onClick={() => setShowDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
         إضافه خبر جديد
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <NewsTickerDialog
          onSuccess={handleDialogClose}
          onCancel={handleDialogClose}
          editingNews={editingNews}
        />
      </Dialog>

      {newsItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No news items found. Add one to get started!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العنوان</TableHead>
              <TableHead>التفاصيل</TableHead>
              <TableHead>مده عرض الخبر بالميلي ثانيه (ms)</TableHead>
              <TableHead>إداره</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsItems.map((news) => (
              <TableRow key={news.id}>
                <TableCell className="font-medium">{news.title}</TableCell>
                <TableCell className="max-w-md truncate">
                  {news.description}
                </TableCell>
                <TableCell>{news.duration}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(news)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(news.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default NewsTickerList;