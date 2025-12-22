import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartHomeViz AI - Intelligent Home Layout Visualization',
  description: 'Design your intelligent digital home layout with AI-powered suggestions and real-time 3D visualization',
  icons: '/favicon.ico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
