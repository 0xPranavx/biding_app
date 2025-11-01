import { Fullscreen } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-950 font-sans dark:bg-black">
      <div className="">
        <Image src= "/wwwhirl.svg" alt="broo" width={100} height={100}  className="absolute left-0 top-0 h-full w-auto object-contain "/>
      </div>
           
      <main className="flex  z-10 min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16  dark:bg-black sm:items-start">
       <Image
          className="dark:invert mb-0"
          src="/acl.png"
          alt="Next.js logo"
          width={150}
          height={75}
          priority
        />
        
        <div className="flex flex-col items-center sm:gap-4 gap-2 sm:items-start sm:text-left">
        
        
         <h1 className="max-w-xl text-4xl sm:text-6xl  font-semibold leading-16 tracking-tight text-white dark:text-zinc-50">
            ASHIRWAD CHAMPIONS LEAGUE
          </h1>
       
         <p className="sm:text-1xl font-mono text-white"> Powered By Ashirward Board of Cricket League Special partner AZMM</p>
        
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
         
        </div>
      </main>
    </div>
  );
}
