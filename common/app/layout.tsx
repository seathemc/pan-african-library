import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Common — A legal architecture for Africa's single digital market",
  description:
    "Common is a movement to integrate Africa's startup acts into one coherent legal architecture: a Pan-African Startup Entity, a Startup Passport, surgical national reforms, and an enhanced AU Model Law.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
