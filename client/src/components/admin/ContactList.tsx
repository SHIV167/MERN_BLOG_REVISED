import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FaEye, FaTrash, FaCheck } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const ContactList = () => {
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch contacts
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['/api/contacts'],
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/contacts/${id}/read`, {});
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Message marked as read",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to mark message as read",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contacts/${id}`, {});
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setIsDeleteOpen(false);
      toast({
        title: "Message deleted",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete message",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleView = (contact: any) => {
    setSelectedContact(contact);
    setIsViewOpen(true);
    
    // Mark as read if unread
    if (!contact.isRead) {
      markAsReadMutation.mutate(contact.id);
    }
  };

  const handleDelete = (contact: any) => {
    setSelectedContact(contact);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContact) {
      deleteContactMutation.mutate(selectedContact.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        {Array(5).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts && contacts.length > 0 ? (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{contact.subject}</TableCell>
                  <TableCell>{format(new Date(contact.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {contact.isRead ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Read
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-blue-500">
                        New
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleView(contact)}
                      className="text-blue-500"
                    >
                      <FaEye size={16} />
                    </Button>
                    {!contact.isRead && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => markAsReadMutation.mutate(contact.id)}
                        className="text-green-500"
                      >
                        <FaCheck size={16} />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(contact)}
                      className="text-red-500"
                    >
                      <FaTrash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No messages found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Message Dialog */}
      {selectedContact && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedContact.subject}</DialogTitle>
              <DialogDescription>
                From: {selectedContact.name} ({selectedContact.email})
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 border-t pt-4">
              <p className="whitespace-pre-wrap">{selectedContact.message}</p>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              Received on {format(new Date(selectedContact.createdAt), 'MMMM d, yyyy h:mm a')}
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
              <Button variant="destructive" onClick={() => {
                setIsViewOpen(false);
                handleDelete(selectedContact);
              }}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactList;
