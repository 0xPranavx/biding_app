// page.tsx or UsersPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UserTable } from "@/components/UserTable";

type User = {
  id: number;
  created_at: string;
  user_name: string;
  user_type: string;
  user_bid_price: number;
  user_start_price: number;
  user_sold_flg: string;
  user_owner_id: number | null;
  user_profile_url: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return <UserTable users={users} />;
}
