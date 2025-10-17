
import { useState, useRef, useEffect } from "react";
import { DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Type, Bold, Italic } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface NewsTickerDialogProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingNews?: any;
}

const NewsTickerDialog = ({ onSuccess, onCancel, editingNews }: NewsTickerDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fontSize, setFontSize] = useState("16");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [newsItem, setNewsItem] = useState({
    title: "",
    description: "",
    image: "",
    duration: "3000",
  });

  useEffect(() => {
    if (editingNews) {
      setNewsItem({
        title: editingNews.title || "",
        description: editingNews.description || "",
        image: editingNews.image || "",
        duration: editingNews.duration?.toString() || "3000",
      });
    }
  }, [editingNews]);

  const handleSubmit = async () => {
    if (!newsItem.title || !newsItem.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const itemData = {
        title: newsItem.title,
        description: newsItem.description,
        image: newsItem.image || null,
        duration: parseInt(newsItem.duration),
        is_active: true
      };

      if (editingNews?.id) {
        const { error } = await supabase
          .from("news_ticker_items")
          .update(itemData)
          .eq('id', editingNews.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "News item updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from("news_ticker_items")
          .insert(itemData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "News item added successfully!",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["news-ticker-items"] });
      onSuccess();
    } catch (error: any) {
      console.error("Error adding/updating news item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save news item. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyStyle = (style: string) => {
    if (!textAreaRef.current) return;
    
    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    
    if (start === end) {
      toast({
        description: "Please select some text first",
      });
      return;
    }

    const text = newsItem.description;
    const selectedText = text.substring(start, end);
    let newText = text;

    switch(style) {
      case 'bold':
        newText = 
          text.substring(0, start) +
          `<strong>${selectedText}</strong>` +
          text.substring(end);
        break;
      case 'italic':
        newText = 
          text.substring(0, start) +
          `<em>${selectedText}</em>` +
          text.substring(end);
        break;
      case 'fontSize':
        newText = 
          text.substring(0, start) +
          `<span style="font-size: ${fontSize}px">${selectedText}</span>` +
          text.substring(end);
        break;
    }

    setNewsItem(prev => ({ ...prev, description: newText }));
  };

  return (
    <DrawerContent className="max-h-[90vh]">
      <div className="mx-auto w-full max-w-4xl">
        <DrawerHeader className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DrawerTitle className="text-right">{editingNews ? "تعديل الخبر" : "إضافه خبر جديد"}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-0 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium text-right">
                العنوان
              </label>
              <Input
                id="title"
                value={newsItem.title}
                onChange={(e) => setNewsItem((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter news title"
                dir="rtl"
                className="text-right text-lg p-6"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <label htmlFor="description" className="text-sm font-medium text-right flex-grow">
                    التفاصيل
                  </label>
                  <div className="flex items-center gap-2 bg-secondary rounded-md p-2">
                    <Button 
                      type="button" 
                      variant="secondary"
                      size="sm"
                      onClick={() => applyStyle('bold')}
                      className="gap-2"
                    >
                      <Bold className="h-4 w-4" />
                      Bold
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary"
                      size="sm"
                      onClick={() => applyStyle('italic')}
                      className="gap-2"
                    >
                      <Italic className="h-4 w-4" />
                      Italic
                    </Button>
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <Input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="w-20 h-8"
                        min="8"
                        max="72"
                      />
                      <Button 
                        type="button" 
                        variant="secondary"
                        size="sm"
                        onClick={() => applyStyle('fontSize')}
                      >
                        Apply Size
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Textarea
                ref={textAreaRef}
                value={newsItem.description}
                onChange={(e) => setNewsItem(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[400px] text-right resize-none text-lg leading-relaxed p-6"
                placeholder="Enter news description"
                dir="rtl"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="image" className="text-sm font-medium text-right">
                رابط الصوره (Optional)
              </label>
              <Input
                id="image"
                value={newsItem.image}
                onChange={(e) => setNewsItem((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="Enter image URL"
                dir="rtl"
                className="text-right text-lg p-6"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="duration" className="text-sm font-medium text-right">
                مده عرض الاعلان بالميلي ثانيه  (ms)
              </label>
              <Input
                id="duration"
                type="number"
                min="1000"
                step="500"
                value={newsItem.duration}
                onChange={(e) => setNewsItem((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="Enter duration in milliseconds"
                dir="rtl"
                className="text-right text-lg p-6"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t pb-6">
            <Button variant="outline" onClick={onCancel} size="lg">
              إلغاء
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </DrawerContent>
  );
};

export default NewsTickerDialog;
