import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ashirwad Champions League",
  description: "Powered By AZMM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className="bg-[#0E0915]  flex h-screen flex-col justify-between "
      >
         <nav className="flex justify-start items-center mt-2 m-2 p-2 border-b border-blue border-dashed border-neutral ">
        <Image src={"/acl.png"} width={50} height={10} alt="logo" />
      
     
       <Link href="/"> <h1 className="text-xl font-bold mr-2 text-white">ACL2025</h1> </Link>
      </nav> 
        <div>
          {children}
        </div>
       <footer className="flex justify-start items-center  w-full">
      
       <p className="text-md p-1 text-white">Made with ♥ by <Link className="text-blue-400" href="https://x.com/0xPranavx">2Players</Link> 
       . <Link className="text-blue-400" href="https://buymeacoffee.com/praanav9994" >buy me a coffee</Link> to support me.</p>
      </footer>
         
        
      </body>
    </html>
  );  
}
