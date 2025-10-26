"use client";

import * as React from "react";
// import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type User = {
  id: number;
  user_name: string;
  user_type: string;
  user_bid_price: number;
  user_start_price: number;
  user_sold_flg: string;
  user_owner_id: number | null;
  user_profile_url: string;
  owner_name?: string; // optional if joined with owners table
};

export function UserCarousel({ users }: { users: User[] }) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        // plugins={[
        //   Autoplay({
        //     delay: 4000,
        //   }),
        // ]}
      >
        <CarouselContent>
          {users.map((user) => (
            <CarouselItem
              key={user.id}
              className="md:basis-1/3 lg:basis-1/4"
            >
              <Card className="shadow-md border rounded-2xl p-4">
                <CardContent className="flex flex-col items-center text-center gap-3 p-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.user_profile_url} alt={user.user_name} />
                    <AvatarFallback>{user.user_name[0]}</AvatarFallback>
                  </Avatar>

                  <h2 className="font-semibold text-lg">{user.user_name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {user.user_type}
                  </p>

                  <div className="flex flex-col gap-1 mt-2">
                    <p className="text-sm">
                      <strong>Start Price:</strong> ₹{user.user_start_price}
                    </p>
                    <p className="text-sm">
                      <strong>Bid Price:</strong> ₹{user.user_bid_price}
                    </p>
                  </div>

                  <div className="mt-2">
                    {user.user_sold_flg === "Y" ? (
                      <p className="text-green-600 font-medium">
                        Sold to: {user.owner_name || "Owner ID " + user.user_owner_id}
                      </p>
                    ) : (
                      <p className="text-red-500 font-medium">Not Sold</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
