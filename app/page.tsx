import { Fullscreen } from "lucide-react";
import Image from "next/image";
import Link from 'next/link'
import { Card , CardContent , CardDescription , CardHeader , CardFooter  ,CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
   <div className="flex justify-center items-center  h-screen w-screen bg-[#0E0915]">
     <Image src={"/fade_gradient.svg"} alt = 'broo' fill className="absolute inset-0 w-full h-full object-cover" />
  
     <Card className=" w-full md:w-6/12 bg-[#0E0915] text-white border-0">
      <CardHeader>
        <Image src={"/acl.png"} width={100} alt="broo" height={50}/>
        <CardTitle className="md:text-6xl text-2xl">Ashirwad Champions League</CardTitle>
        <CardDescription className="md:text-lg ">Powered By BCCA , Special Partner AZMM</CardDescription>
      </CardHeader>
      <CardContent className="md:text-2xl ">
      Welcome to one of the most premium cricket auctions Ashirwad Champion league League.
Discover top players, passionate owners, and the thrill of every bid below.
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button size='lg' className="text-lg border-dashed border-white bg-[#0E0915] text-white" variant="outline"><Link href="/players">Players</Link></Button>
       
      </CardFooter>
    </Card>
   </div>
  );
}
