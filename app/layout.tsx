import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { AuthProvider } from '../components/AuthContext';
import { ThemeProvider } from '../components/ThemeContext';
import { I18nProvider } from '../components/I18nContext';
import AuthModal from '../components/AuthModal';

export const metadata: Metadata = {
  title: 'PixelGamez — Free Online Games',
  description: 'Play free online games at PixelGamez. Browse hundreds of high-quality browser games across action, puzzle, racing, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        {adSenseClientId && (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`} crossOrigin="anonymous"></script>
        )}
      </head>
      <body suppressHydrationWarning>
        <I18nProvider>
          <AuthProvider>
          <ThemeProvider>
            <div id="app">
              <div id="app-header">
                <Header />
              </div>
              <div id="app-sidebar">
                <Sidebar />
              </div>
              <main id="app-main">
                <div id="app-content">
                  {children}
                </div>
              </main>
            </div>
            <AuthModal />
          </ThemeProvider>
        </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
