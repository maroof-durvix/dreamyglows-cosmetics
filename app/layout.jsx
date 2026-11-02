import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import BrandLoader from "@/components/ui/BrandLoader";
import { AuthProvider, AuthGuard } from "@/context/AuthContext";
export const metadata = {
  title: "DreamyGlows | Premium Skincare & Scalp Serums",
  description: "Experience professional medical-grade skincare and scalp treatments. Formulated with pure ingredients for visible radiance, acne clearing, and hair growth in Pakistan.",
  keywords: ["Skincare Pakistan", "Vitamin C Serum", "Niacinamide Serum", "Rosemary Hair Serum", "Organic Skincare", "DreamyGlows"],
  openGraph: {
    title: "DreamyGlows | Premium Skincare & Scalp Serums",
    description: "Experience professional medical-grade skincare and scalp treatments.",
    type: "website",
    locale: "en_US",
    url: "https://dreamyglows.com",
    siteName: "DreamyGlows"
  }
};
export default function RootLayout({
  children
}) {
  return <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
    href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&display=swap"
    rel="stylesheet"
  />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#072417" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <BrandLoader />
        <AuthProvider>
          <AuthGuard>
            <CartProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <WhatsAppButton />
            </CartProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>;
}
