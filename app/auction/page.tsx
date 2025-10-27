"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UserCarousel } from "@/components/UserCarousel";

type User = {
  id: number;
  user_name: string;
  user_type: string;
  user_bid_price: number;
  user_start_price: number;
  user_sold_flg: string;
  user_owner_id: number | null;
  user_profile_url: string;
  owner_name?: string;
};

export default function UsersCarouselPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      // 👇 fetch user info along with owner name
      const { data, error } = await supabase
        .from("users")
        .select(`
          id,
          user_name,
          user_type,
          user_bid_price,
          user_start_price,
          user_sold_flg,
          user_owner_id,
          user_profile_url,
          owners:owners!users_user_owner_id_fkey(owner_name)
        `);

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      const formattedUsers =
        data?.map((u : any ) => ({
          ...u,
          owner_name: u.owners?.owner_name ?? null,
        })) || [];

      setUsers(formattedUsers);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Player Carousel</h1>
      <UserCarousel users={users} />
    </div>
  );
}
