import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Star, Send, Loader2, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً لكتابة تقييم');
      return;
    }
    
    if (rating === 0) {
      toast.error('يرجى اختيار تقييم');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('يرجى كتابة تعليق');
      return;
    }

    if (!reviewerName.trim()) {
      toast.error('يرجى إدخال اسمك');
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert new review (allow multiple reviews per user per product)
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          rating: rating,
          comment: comment.trim(),
          user_id: user.id,
          reviewer_name: reviewerName.trim(),
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to save review');
      }

      toast.success('تم حفظ تقييمك بنجاح!');
      
      // Reset form
      setRating(0);
      setHoveredRating(0);
      setComment('');
      setReviewerName('');
      
      // Notify to refresh reviews
      window.dispatchEvent(new Event('reviewSubmitted'));
      onReviewSubmitted?.();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('حدث خطأ في إرسال التقييم، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <LogIn className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">تسجيل الدخول مطلوب</h3>
            <p className="text-gray-600">يجب تسجيل الدخول لكتابة تقييم للمنتج</p>
          </div>
          <Button 
            onClick={() => {
              const authButton = document.querySelector('[data-auth-trigger]') as HTMLButtonElement;
              if (authButton) {
                authButton.click();
              } else {
                toast.error('عذراً، لا يمكن فتح نافذة تسجيل الدخول في الوقت الحالي');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <LogIn className="h-4 w-4 ml-2" />
            تسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl text-center text-gray-900">
          📝 أضف تقييمك
        </CardTitle>
        <p className="text-center text-gray-600">
          شاركنا تجربتك مع هذا المنتج
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسمك
            </label>
            <Input
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="أدخل اسمك..."
              className="w-full"
              required
            />
          </div>

          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التقييم
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="mr-2 text-sm text-gray-600">
                {rating > 0 && (
                  <>
                    {rating} من 5 نجوم
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التعليق
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شاركنا رأيك في المنتج..."
              rows={4}
              className="w-full resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 ml-2" />
                إرسال التقييم
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}