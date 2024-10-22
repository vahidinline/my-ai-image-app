'use client';
// pages/auth/signin.tsx
import { signIn, signOut, useSession } from 'next-auth/react';

export default function SignIn() {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <>
          <h2>You are not signed in</h2>
          <button onClick={() => signIn('google')}>Sign in with Google</button>
        </>
      ) : (
        <>
          <h2>Welcome, {session.user?.name}</h2>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
