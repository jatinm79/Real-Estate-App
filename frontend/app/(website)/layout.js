import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Prime Properties - Find Your Dream Home',
  description: 'Discover premium real estate properties with Prime Properties. Find your perfect home with our curated listings.',
  keywords: 'real estate, properties, homes, apartments, buy property',
};

export default function WebsiteLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
          {children}
        </div>
      </body>
    </html>
  );
}