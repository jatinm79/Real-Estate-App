'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Building2, 
  Plus, 
  Settings,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Properties', href: '/admin/properties', icon: Building2 },
  { name: 'Add Property', href: '/admin/properties/add', icon: Plus },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
        </Link>
      </div>

      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Home className="h-5 w-5" />
          <span>View Website</span>
        </Link>
      </div>
    </div>
  );
}