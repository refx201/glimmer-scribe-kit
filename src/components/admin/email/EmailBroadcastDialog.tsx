import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { v4 as uuidv4 } from 'uuid';

interface EmailBroadcastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmails: string[];
  onSuccess?: () => void;
}

export function EmailBroadcastDialog({ 
  open, 
  onOpenChange,
  selectedEmails,
  onSuccess 
}: EmailBroadcastDialogProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!subject || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      console.log("Creating broadcast record...");
      // Create broadcast record
      const { data: broadcast, error: broadcastError } = await supabase
        .from('email_broadcasts')
        .insert({
          subject,
          message,
          status: 'pending'
        })
        .select()
        .single();

      if (broadcastError) throw broadcastError;

      console.log("Created broadcast:", broadcast);

      // Create recipient records with UUID for each
      const recipientRecords = selectedEmails.map(email => ({
        id: uuidv4(), // Generate UUID for each recipient
        broadcast_id: broadcast.id,
        email,
        status: 'pending'
      }));

      console.log("Inserting recipient records:", recipientRecords);

      const { error: recipientsError } = await supabase
        .from('email_broadcast_recipients')
        .insert(recipientRecords);

      if (recipientsError) throw recipientsError;

      console.log("Recipients inserted successfully");

      // Call edge function to send emails
      const { error: sendError } = await supabase.functions.invoke('send-broadcast', {
        body: {
          broadcastId: broadcast.id,
          subject,
          message,
          recipients: selectedEmails.map(email => ({ email }))
        }
      });

      if (sendError) {
        // Check if it's a validation error from Resend
        if (sendError.message?.includes('validation_error')) {
          toast({
            title: "Email Sending Restricted",
            description: "During testing, emails can only be sent to verified domains. Please verify your domain in Resend dashboard first.",
            variant: "destructive",
          });
        } else {
          throw sendError;
        }
      } else {
        toast({
          title: "Success",
          description: "Email broadcast initiated successfully",
        });
        onSuccess?.();
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Error sending broadcast:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send broadcast",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Email Broadcast</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              During testing, emails can only be sent to verified domains. Please verify your domain in the Resend dashboard first.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Sending to {selectedEmails.length} recipient(s)
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="Message (HTML supported)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
            />
          </div>
          <Button 
            onClick={handleSend} 
            disabled={isSending || !subject || !message}
          >
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSending ? "Sending..." : "Send Broadcast"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}