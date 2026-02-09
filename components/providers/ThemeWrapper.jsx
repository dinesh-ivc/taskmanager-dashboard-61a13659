'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function ThemeWrapper({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}