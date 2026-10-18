import './globals.css';
import './extra.css';
import './home.css';
import './cal.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Kidora — Bog‘cha platformasi',
  description: 'Ota-onalar, o‘qituvchilar va bolalar uchun aqlli bog‘cha platformasi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800;900&family=Nunito:wght@500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
