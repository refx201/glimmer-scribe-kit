
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FAQ, FAQInsert, FAQUpdate } from '@/types/faq';

interface FAQDialogProps {
  onClose: () => void;
  onSuccess: () => void;
  editingFAQ?: {
    id: string;
    question: string;
    answer: string;
  } | null;
}

const FAQDialog = ({ onClose, onSuccess, editingFAQ }: FAQDialogProps) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editingFAQ) {
      setQuestion(editingFAQ.question);
      setAnswer(editingFAQ.answer);
    }
  }, [editingFAQ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingFAQ) {
        // Update existing FAQ - use type assertion for Supabase
        const updateData = {
          question,
          answer,
        };
        
        const { error } = await supabase
          .from('faqs' as any)
          .update(updateData)
          .eq('id', editingFAQ.id);

        if (error) throw error;

        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث السؤال والجواب بنجاح",
        });
      } else {
        // Create new FAQ - use type assertion for Supabase
        const insertData = {
          question,
          answer,
          is_active: true,
          order_index: 0,
          category: 'general',
        };
        
        const { error } = await supabase
          .from('faqs' as any)
          .insert(insertData);

        if (error) throw error;

        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة السؤال والجواب بنجاح",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error submitting FAQ:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DrawerContent className="max-h-[85vh]">
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DrawerTitle>{editingFAQ ? "تعديل سؤال وجواب" : "إضافة سؤال وجواب جديد"}</DrawerTitle>
          <DrawerDescription>
            أدخل السؤال والجواب لعرضهما في واجهة الدردشة
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0 overflow-y-auto max-h-[calc(85vh-120px)]">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="question">السؤال</Label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="أدخل السؤال هنا"
                  className="text-right"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="answer">الجواب</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="أدخل الجواب هنا"
                  className="min-h-[100px] text-right"
                />
              </div>
            </div>
            <DrawerFooter className="pt-4 pb-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'جارٍ الحفظ...' : editingFAQ ? 'تحديث' : 'إضافة'}
              </Button>
            </DrawerFooter>
          </form>
        </div>
      </div>
    </DrawerContent>
  );
};

export default FAQDialog;
