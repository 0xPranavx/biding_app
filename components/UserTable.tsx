// UserTable.tsx
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface UserTableProps {
  users: User[];
}

export const UserTable: React.FC<UserTableProps> = ({ users }) => {

  console.log(users);
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Bid Price</TableHead>
            <TableHead>Start Price</TableHead>
            <TableHead>Sold</TableHead>
            
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              {/* User Name with Avatar */}
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={`https://zobdcchizknpihqxfodv.supabase.co/storage/v1/object/public/users_images/${user.id}.jpg`} alt={user.user_name} />
                    <AvatarFallback>{user.user_name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{user.user_name}</span>
                </div>
              </TableCell>

              <TableCell>{user.user_type}</TableCell>
              <TableCell>{user.user_bid_price}</TableCell>
              <TableCell>{user.user_start_price}</TableCell>
              <TableCell>{user.user_sold_flg}</TableCell>
            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
