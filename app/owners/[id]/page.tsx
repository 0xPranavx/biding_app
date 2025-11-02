"use client";
import React from 'react'

import { useParams } from 'next/navigation'

export default function OwnerDetails() {
    const params = useParams();
    const ownerId = params.id ;


  return (
    <div>{ownerId} hello world</div>
  )
}
