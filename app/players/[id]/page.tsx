"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

type Owner = {
    owner_id: number;
    owner_name: string;
    owner_fund: number;
    owner_logo?: string;
};

const Page = () => {
    const params = useParams();
    const userId = params.id;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Bidding state
    const [owners, setOwners] = useState<Owner[]>([]);
    const [bidLoading, setBidLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [bidCounter, setBidCounter] = useState(0);

    // Initialize bid counter when user loads
    useEffect(() => {
        if (user) {
            setBidCounter(user.user_bid_price);
        }
    }, [user]);

    // Real-time subscription
    useEffect(() => {
        if (!user) return;

        // Subscribe to user changes
        const userSubscription = supabase
            .channel('user-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'users',
                    filter: `id=eq.${user.id}`
                },
                (payload) => {
                    console.log('User update received:', payload);
                    const updatedUser = payload.new as User;
                    setUser(updatedUser);
                    // Update counter to reflect new bid price
                    setBidCounter(updatedUser.user_bid_price);
                }
            )
            .subscribe();

        // Subscribe to owner changes
        const ownerSubscription = supabase
            .channel('owner-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'owners'
                },
                () => {
                    // Refetch owners when any owner changes
                    fetchOwners();
                }
            )
            .subscribe();

        return () => {
            userSubscription.unsubscribe();
            ownerSubscription.unsubscribe();
        };
    }, [user]);

    const placeBid = async (userId: number, ownerId: number, bidAmount: number) => {
        try {
            // 1. Get current owner fund
            const { data: ownerData, error: ownerError } = await supabase
                .from("owners")
                .select("owner_fund, owner_name")
                .eq("owner_id", ownerId)
                .single();

            if (ownerError) throw ownerError;
            if (!ownerData) throw new Error("Owner not found");

            if (ownerData.owner_fund < bidAmount) {
                throw new Error(`Insufficient funds. ${ownerData.owner_name} has only ₹${ownerData.owner_fund}`);
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
        } catch (error: any) {
            console.error("Error placing bid:", error);
            return { success: false, error: error.message };
        }
    };

    const handleBid = async (ownerId: number, ownerName: string) => {
        if (!user) return;
        
        setBidLoading(true);
        setMessage("");

        const result = await placeBid(user.id, ownerId, bidCounter);

        if (result.success) {
            setMessage(`Bid placed successfully! ${ownerName} bought for ₹${bidCounter}`);
        } else {
            setMessage(`Error: ${result.error}`);
        }
        setBidLoading(false);
    };

    // Counter controls
    const increaseBid = (amount: number) => {
        setBidCounter(prev => prev + amount);
    };

    const decreaseBid = (amount: number) => {
        setBidCounter(prev => Math.max(user?.user_start_price || 0, prev - amount));
    };

    const fetchUser = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) {
                throw error;
            }

            setUser(data);
        } catch (err) {
            console.error("Error fetching user:", err);
            setError("Failed to load player data");
        } finally {
            setLoading(false);
        }
    };

    const fetchOwners = async () => {
        try {
            const { data, error } = await supabase
                .from("owners")
                .select("*")
                .order("owner_id", { ascending: true });

            if (error) {
                throw error;
            }

            setOwners(data || []);
        } catch (err) {
            console.error("Error fetching owners:", err);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchOwners();
    }, [userId]);

    if (loading) {
        return (
            <div className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center">
                <div className="text-white text-xl">Loading player...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center">
                <div className="text-white text-xl">Player not found</div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden">
            {/* Background image (lowest layer) */}
            <img
                src="/background.png"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover -z-50"
            />

            {/* Pattern overlay (above background) */}
            <img
                src="/pattern.png"
                alt="Pattern Overlay"
                className="absolute inset-0 w-full h-full object-cover -z-30"
            />

            {/* Header logos */}
            <div className="absolute top-2 left-0 gap-4 w-full h-fit flex justify-center items-center">
                <img
                    src="/bcca.png"
                    alt="BCCA Logo"
                    className="h-30 w-auto object-cover z-20"
                />
                <img
                    src="/font-2.png"
                    alt="Font Logo"
                    className="w-auto h-30 object-cover z-20"
                />
                <img
                    src="/acl.png"
                    alt="ACL Logo"
                    className="w-auto h-30 object-cover z-20"
                />
            </div>

            {/* Player Content */}
            <div className="absolute flex justify-center items-center left-1/2 translate-x-[-50%] bottom-30 w-full z-10">
                {/* Player Image */}
                <img
                    src={`https://zobdcchizknpihqxfodv.supabase.co/storage/v1/object/public/users_images/${user.id}.jpg`}
                    alt={user.user_name}
                    className="absolute bottom-40 w-120 h-120 object-contain -mb-4 z-20"
                />
                
                {/* Flash Effect */}
                <img
                    src={`/flash.png`}
                    alt="Flash effect"
                    className="absolute bottom-40 w-120 h-120 object-contain -mb-4 z-10"
                />
                
                {/* Bid Box */}
                <img
                    src="/bid-box-2.png"
                    alt="Bid Box"
                    className="w-auto h-40 z-30 object-contain"
                />
                
                {/* Player Name */}
                <div className="text-white z-40 text-[32px] mb-14 capitalize font-bold absolute inset-0 flex items-center justify-center">
                    {user.user_name}
                </div>
                
                {/* Start Price */}
                <div className="text-white z-40 text-[32px] mb-2 left-1/2 translate-x-[-40%] capitalize font-bold absolute inset-0 flex items-center justify-start">
                    ₹{user.user_start_price.toLocaleString()}
                </div>
                
                {/* Current Bid with Increment/Decrement */}
                <div className="text-white z-40 text-[32px] mb-2 left-1/2 translate-x-[25%] capitalize font-bold absolute inset-0 flex items-center justify-start">
                    <div className="flex items-center gap-3">
                        {/* Decrement Button */}
                        <button
                            onClick={() => decreaseBid(50)}
                            disabled={bidCounter <= user.user_start_price}
                            className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
                        >
                            -
                        </button>
                        
                        {/* Current Bid Display */}
                        <span>₹{bidCounter.toLocaleString()}</span>
                        
                        {/* Increment Button */}
                        <button
                            onClick={() => increaseBid(50)}
                            className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-green-700 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="absolute left-1/2 bottom-[400px] translate-x-[-50%] translate-y-[50%] z-40 ">
                    {user.user_sold_flg === 'Y' ? <img src="/sold.png" alt="Sold" className="w-80 object-contain" /> : ''}
                </div>
            </div>

            {/* Bidding Buttons */}
            <div className="fixed bottom-2 left-0 w-full px-3 z-50">
                <div className="">
                    <div className="text-center mb-2">
                        <h3 className="text-white text-base font-semibold">
                            Place Bid (₹{bidCounter.toLocaleString()})
                        </h3>
                        <p className="text-white/60 text-xs">
                            Sell player to selected team
                        </p>
                    </div>

                    {/* Team Buttons */}
                    <div className="flex gap-1.5 justify-center flex-wrap">
                        {owners.map((owner) => (
                            <button
                                key={owner.owner_id}
                                onClick={() => handleBid(owner.owner_id, owner.owner_name)}
                                disabled={
                                    bidLoading ||
                                    user.user_sold_flg === "Y" ||
                                    owner.owner_fund < bidCounter
                                }
                                className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg font-semibold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:from-blue-700 hover:to-purple-700 active:scale-95"
                            >
                                <div className="truncate">{owner.owner_name}</div>
                                <div className="text-[10px] opacity-80 truncate">
                                    ₹{owner.owner_fund.toLocaleString()}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Message */}
                    {message && (
                        <div
                            className={`mt-2 p-1.5 rounded-lg text-center text-xs font-medium ${
                                message.includes("Error") || message.includes("Insufficient")
                                    ? "bg-red-500/20 text-red-200 border border-red-500/30"
                                    : "bg-green-500/20 text-green-200 border border-green-500/30"
                            }`}
                        >
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;