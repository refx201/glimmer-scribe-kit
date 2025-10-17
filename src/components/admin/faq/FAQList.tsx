import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, MessagesSquare } from "lucide-react";
import FAQDialog from "./FAQDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FAQ } from "@/types/faq";

const FAQList = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [deletingFAQ, setDeletingFAQ] = useState<FAQ | null>(null);
  const { toast } = useToast();

  const fetchFAQs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('faqs' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Force type to FAQ[] with double type assertion
      setFaqs(data as any as FAQ[]);
    } catch (error: any) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message || "حدث خطأ أثناء تحميل الأسئلة والأجوبة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleDelete = async () => {
    if (!deletingFAQ) return;
    
    try {
      const { error } = await supabase
        .from('faqs' as any)
        .delete()
        .eq('id', deletingFAQ.id);
      
      if (error) throw error;
      
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف السؤال والجواب بنجاح",
      });
      
      fetchFAQs();
    } catch (error: any) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف السؤال والجواب",
        variant: "destructive",
      });
    } finally {
      setDeletingFAQ(null);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setShowAddDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setEditingFAQ(null);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessagesSquare className="h-5 w-5" />
          إدارة الأسئلة الشائعة
        </h2>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة سؤال جديد
            </Button>
          </DialogTrigger>
          <FAQDialog 
            onClose={handleCloseDialog}
            onSuccess={() => {
              fetchFAQs();
              handleCloseDialog();
            }}
            editingFAQ={editingFAQ}
          />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <MessagesSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">لا توجد أسئلة شائعة</h3>
          <p className="text-gray-500 mb-4">قم بإضافة أسئلة وأجوبة ليتم عرضها في صفحة الدردشة</p>
          <Button 
            onClick={() => setShowAddDialog(true)}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            إضافة سؤال جديد
          </Button>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>السؤال</TableHead>
                <TableHead>الجواب</TableHead>
                <TableHead>تاريخ الإضافة</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">{faq.question}</TableCell>
                  <TableCell className="max-w-xs truncate">{faq.answer}</TableCell>
                  <TableCell>
                    {new Date(faq.created_at).toLocaleDateString('ar')}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(faq)}
                        className="w-8 h-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingFAQ(faq)}
                        className="w-8 h-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 text-sm text-gray-500 flex items-center justify-between">
            <span>إجمالي الأسئلة: {faqs.length}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchFAQs}
              className="text-xs"
            >
              تحديث القائمة
            </Button>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingFAQ} onOpenChange={(open) => !open && setDeletingFAQ(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف السؤال "{deletingFAQ?.question}" ولن تتمكن من استعادته.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FAQList;
