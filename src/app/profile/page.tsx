'use client';

import ProfileCard from '@/component/Profile/ProfileCard';
import { useSession } from 'next-auth/react';

import React from 'react';

function page() {
  const { data: session } = useSession();
  return (
    <div>
      <ProfileCard session={session} />
    </div>
  );
}

export default page;
