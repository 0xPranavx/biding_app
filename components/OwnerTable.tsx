"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Owner = {
  owner_id: number;
  created_at: string;
  owner_name: string;
  owner_team_name: string;
  owner_fund: number;
  owner_image_url: string;
};

export function OwnerTable({ owners }: { owners: Owner[] }) {
  return (
    <Card className="shadow-md border rounded-2xl">
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Owner Name</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>Available Fund (₹)</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {owners.map((owner) => (
              <TableRow key={owner.owner_id}>
                <TableCell>
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={owner.owner_image_url}
                      alt={owner.owner_name}
                    />
                    <AvatarFallback>
                      {owner.owner_name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                <TableCell className="font-medium">
                  {owner.owner_name}
                </TableCell>
                <TableCell>{owner.owner_team_name}</TableCell>
                <TableCell>{owner.owner_fund}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
