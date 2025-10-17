import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EmailBroadcastDialog } from "./EmailBroadcastDialog";
import { Mail, Users, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EmailBroadcastList() {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const ADMIN_PASSWORD = "admin123";

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setPassword("");
      toast({
        title: "Access Granted",
        description: "You can now manage email broadcasts.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch registered users
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching registered users...");
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      
      return profiles;
    },
    enabled: isUnlocked,
  });

  // Fetch only the 5 most recent broadcasts
  const { data: broadcasts } = useQuery({
    queryKey: ["email-broadcasts"],
    queryFn: async () => {
      console.log("Fetching recent broadcasts...");
      const { data, error } = await supabase
        .from("email_broadcasts")
        .select(`
          *,
          email_broadcast_recipients (
            email,
            status,
            sent_at
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5); // Limit to 5 most recent broadcasts

      if (error) {
        console.error("Error fetching broadcasts:", error);
        throw error;
      }
      
      console.log("Fetched broadcasts:", data);
      return data;
    },
    enabled: isUnlocked,
  });

  const handleSelectAll = () => {
    if (users) {
      if (selectedEmails.length === users.length) {
        setSelectedEmails([]);
      } else {
        setSelectedEmails(users.map(user => user.email!).filter(Boolean));
      }
    }
  };

  const handleSelectEmail = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  if (!isUnlocked) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-center space-y-2">
            <Lock className="h-12 w-12 mx-auto text-gray-400" />
            <h2 className="text-xl font-bold">Protected Section</h2>
            <p className="text-sm text-gray-500">
              Please enter the password to manage email broadcasts
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            />
            <Button onClick={handleUnlock}>Unlock</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Broadcasts
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUnlocked(false)}
            className="gap-2"
          >
            <Lock className="h-4 w-4" />
            Lock Section
          </Button>
          <Button
            onClick={() => setShowBroadcastDialog(true)}
            disabled={selectedEmails.length === 0}
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            Send Broadcast
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Recipients
          </h3>
          
          {isLoading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : users?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No registered users found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={users && selectedEmails.length === users.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEmails.includes(user.email!)}
                        onCheckedChange={() => handleSelectEmail(user.email!)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {broadcasts && broadcasts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Previous Broadcasts (Last 5)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {broadcasts.map((broadcast) => (
                  <TableRow key={broadcast.id}>
                    <TableCell className="font-medium">
                      {broadcast.subject}
                    </TableCell>
                    <TableCell>
                      {broadcast.email_broadcast_recipients?.length || 0}
                    </TableCell>
                    <TableCell>{broadcast.status}</TableCell>
                    <TableCell>
                      {new Date(broadcast.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <EmailBroadcastDialog
        open={showBroadcastDialog}
        onOpenChange={setShowBroadcastDialog}
        selectedEmails={selectedEmails}
      />
    </div>
  );
}