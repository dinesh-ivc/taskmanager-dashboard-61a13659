import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeWrapper } from '@/components/providers/ThemeWrapper';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { TaskProvider } from '@/components/providers/TaskProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Task Manager',
  description: 'A modern task management application with authentication',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <TaskProvider>
              {children}
              <Toaster position="top-right" richColors />
            </TaskProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Import at the top level of the file
import { ThemeProvider } from 'next-themes';