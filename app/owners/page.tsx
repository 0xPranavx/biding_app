"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { OwnerTable } from "@/components/OwnerTable";

type Owner = {
  owner_id: number;
  created_at: string;
  owner_name: string;
  owner_team_name: string;
  owner_fund: number;
  owner_image_url: string;
};

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOwners = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("owners")
        .select("*");

      if (error) {
        console.error("Error fetching owners:", error);
      } else {
        setOwners(data || []);
      }
      setLoading(false);
    };

    fetchOwners();
  }, []);

  if (loading) return <div>Loading owners...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Owners Table</h1>
      <OwnerTable owners={owners} />
    </div>
  );
}
