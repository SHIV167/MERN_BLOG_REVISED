import AdminLayout from "@/components/admin/AdminLayout";
import ContactList from "@/components/admin/ContactList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminMessagesPage = () => {
  return (
    <AdminLayout title="Messages">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactList />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminMessagesPage;