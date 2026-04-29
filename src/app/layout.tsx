import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tamoorfans.com"),
  title: "Tamoor Fans - Pakistan's Best 30W Energy Saving Fans | Official Store",
  description: "Buy Tamoor Fans online in Pakistan. Energy-efficient 30W BLDC ceiling fans that save 60% electricity. Free delivery. 2 year warranty. Order now!",
  keywords: ["tamoor fans", "energy saving fans pakistan", "30 watt fans", "bijli bachane wala fan", "BLDC fan pakistan", "tamoor fans price"],
  openGraph: {
    title: "Tamoor Fans - Pakistan's Best Energy Saving Fans",
    description: "Save up to 60% on your electricity bills with Tamoor Energy Saving Fans.",
    images: ["/og-image.jpg"],
    type: "website",
    locale: "en_PK",
  },
  alternates: {
    canonical: "https://www.tamoorfans.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased`} suppressHydrationWarning>
      <body className="font-inter bg-white text-gray-900 min-h-screen">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
