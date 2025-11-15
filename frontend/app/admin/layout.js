import AdminSidebar from './components/AdminSidebar';

export const metadata = {
  title: 'Admin Panel - Prime Properties',
  description: 'Manage your real estate listings',
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}