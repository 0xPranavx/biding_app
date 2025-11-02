import { Fullscreen } from "lucide-react";
import Image from "next/image";
import Link from 'next/link'
import { Card , CardContent , CardDescription , CardHeader , CardFooter  ,CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-[#0E0915]  flex h-screen flex-col justify-between">
       <Image src={"/fade_gradient.svg"} alt = 'broo' fill className="absolute inset-0 w-full h-full object-cover" />
        <nav className="flex justify-start items-center mt-2 m-2 p-2 border-b border-white border-dashed border-neutral ">
        {/* <Image src={"/acl.png"} width={50} height={10} alt="logo" /> */}
          <Link href="/"> <h1 className="text-xl font-bold mr-2 text-white">ACL2025</h1> </Link>
      </nav> 
      
   <div className="flex justify-center items-center  h-full bg-[#0E0915]">
    
  
     <Card className=" w-full md:w-6/12 bg-[#0E0915] text-white border-0">
      <CardHeader>
        <Image src={"/acl.png"} width={100} alt="broo" height={50}/>
        <CardTitle className="md:text-6xl text-3xl">Ashirwad Champions League</CardTitle>
        <CardDescription className="md:text-lg ">Powered By BCCA , Special Partner AZMM</CardDescription>
      </CardHeader>
      <CardContent className=" ">
      Welcome to one of the most premium cricket auctions Ashirwad Champion league League.
Discover top players, passionate owners, and the thrill of every bid below.
      </CardContent>
      <CardFooter className="flex justify-start ">
        <Button size='lg' className="text-lg border-dashed border-white bg-[#0E0915] text-white z-10 mr-1" variant="outline"><Link href="/players">Players</Link></Button>
        <Button size='lg' className="text-lg border-dashed border-white bg-[#0E0915] text-white  z-10" variant="outline"><Link href="/owners">Owners</Link></Button>
      </CardFooter>
    </Card>
    
   </div>
    <footer className="flex justify-start items-center z-10 w-full">
      
       <p className="text-md p-1 text-white">Made with ♥ by <Link className="text-blue-400" href="https://x.com/0xPranavx">2Players</Link> 
       . <Link className="text-blue-400" href="https://buymeacoffee.com/praanav9994" >buy me a coffee</Link> to support me.</p>
      </footer>
   </div>
  );
}
