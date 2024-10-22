'use client';

import { signOut } from '@/app/auth';
import {
  Button,
  DarkThemeToggle,
  Navbar,
  ThemeModeScript,
} from 'flowbite-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export function SiteHeader() {
  const { data: session } = useSession();
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          هوشینه
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {/* <Button>Get started</Button> */}
        <Navbar.Toggle />
      </div>
      <ThemeModeScript />

      <Navbar.Collapse>
        <Navbar.Link
          style={{
            marginLeft: '10px',
          }}
          href="/home">
          ایجاد تصویر
        </Navbar.Link>
        <Navbar.Link href="#">درباره ما</Navbar.Link>
        <Navbar.Link href="#">خدمات</Navbar.Link>
        <Navbar.Link href="#">قیمت ها</Navbar.Link>
        <Navbar.Link href="#">تماس با ما</Navbar.Link>
        {!session && <Navbar.Link href="/login">ورود</Navbar.Link>}

        {session && (
          <Navbar.Link href="/profile">
            <Image
              src={session?.user?.image ?? ''}
              alt="User profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
