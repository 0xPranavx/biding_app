"use client";

import React, { useState } from "react";
// import { placeBid } from "@/server/placebid";
import { supabase } from "@/lib/supabaseClient";
export default function BidForm() {
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [userId , setUserId] = useState<number>(0);
  const [ownerId , setOwnerId] = useState <number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  type BidParams = {
  userId: number ;       // ID of the player being bought
  ownerId: number ;      // ID of the owner who is buying
  bidAmount: number;    // Bidding price entered
};


 const placeBid = async ({ userId, ownerId ,bidAmount }: BidParams) => {

  try {
    // 1. Get current owner fund
    const { data: ownerData, error: ownerError } = await supabase
      .from("owners")
      .select("owner_fund")
      .eq("owner_id", ownerId)
      .single();

    if (ownerError) throw ownerError;
    if (!ownerData) throw new Error("Owner not found");

    if (ownerData.owner_fund < bidAmount) {
      throw new Error("Insufficient funds");
    }

    // 2. Update user table
    const { data: updatedUser, error: userError } = await supabase
      .from("users")
      .update({
        user_bid_price: bidAmount,
        user_sold_flg: "Y",
        user_owner_id: ownerId,
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (userError) throw userError;

    // 3. Deduct fund from owner
    const { data: updatedOwner, error: deductError } = await supabase
      .from("owners")
      .update({
        owner_fund: ownerData.owner_fund - bidAmount,
      })
      .eq("owner_id", ownerId)
      .select("*")
      .single();

    if (deductError) throw deductError;

    return { success: true, updatedUser, updatedOwner };
  } catch (error) {
    console.error("Error placing bid:", error);
    return { success: false, error };
  }
};


  const handleBid = async () => {
    setLoading(true);
    setMessage("");
    const result = await placeBid({ userId, ownerId , bidAmount });

    if (result.success) {
      setMessage("Bid placed successfully!");
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="space-x-2">
        <input type="number"
        placeholder="player id"
        value={userId}
        onChange={(e) => setUserId(Number(e.target.value))}
        className="border p-2 rounded" />
        <input
        type="number"
        placeholder="Enter bider id"
        value={ownerId}
        onChange={(e) => setOwnerId(Number(e.target.value))}
        className="border p-2 rounded"/>
      <input
        type="number"
        placeholder="Enter bid amount"
        value={bidAmount}
        onChange={(e) => setBidAmount(Number(e.target.value))}
        className="border p-2 rounded"
      />
      <button
        onClick={handleBid}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Processing..." : "Place Bid"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
