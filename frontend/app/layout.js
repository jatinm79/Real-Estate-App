import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Prime Properties - Find Your Dream Home',
    template: '%s | Prime Properties'
  },
  description: 'Discover premium real estate properties with Prime Properties. Find your perfect home with our curated listings.',
  keywords: 'real estate, properties, homes, apartments, buy property, luxury homes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {children}
        </div>
      </body>
    </html>
  );
}