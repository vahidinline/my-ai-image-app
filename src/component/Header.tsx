// 'use client';

// import { Navbar, ThemeModeScript } from 'flowbite-react';
// import { useSession } from 'next-auth/react';
// import Image from 'next/image';

// export function SiteHeader() {
//   const { data: session } = useSession();
//   return (
//     <Navbar fluid rounded >
//       <Navbar.Brand href="/">
//         <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
//           هوشینه
//         </span>
//       </Navbar.Brand>
//       <div className="flex md:order-2">
//         {/* <Button>Get started</Button> */}
//         <Navbar.Toggle />
//       </div>
//       <ThemeModeScript />

//       <Navbar.Collapse>

//         <Navbar.Link href="#">درباره ما</Navbar.Link>
//         <Navbar.Link href="#">خدمات</Navbar.Link>
//         <Navbar.Link href="#">قیمت ها</Navbar.Link>
//         <Navbar.Link href="#">تماس با ما</Navbar.Link>
//         {!session && <Navbar.Link href="/login">ورود</Navbar.Link>}

//         {session && (
//           <Navbar.Link href="/profile">
//             <Image
//               src={session?.user?.image ?? ''}
//               alt="User profile"
//               width={32}
//               height={32}
//               className="w-8 h-8 rounded-full"
//             />
//           </Navbar.Link>
//         )}
//       </Navbar.Collapse>
//     </Navbar>
//   );
// }

'use client';

import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { useSession } from 'next-auth/react';
export function SiteHeader() {
  const { data: session } = useSession();
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        {/* <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          هوشینه
        </span>
      </Navbar.Brand>

      <Navbar.Collapse>
        <Navbar.Link
          style={{
            marginLeft: '10px',
          }}
          href="/home">
          ایجاد تصویر
        </Navbar.Link>
        <Navbar.Link href="#" active></Navbar.Link>
        <Navbar.Link href="#">درباره ما</Navbar.Link>
        <Navbar.Link href="#">خدمات</Navbar.Link>
        <Navbar.Link href="#">قیمت ها</Navbar.Link>
        <Navbar.Link href="#">تماس با ما</Navbar.Link>
      </Navbar.Collapse>
      <div dir="rtl" className="flex md:order-2 m-1 p-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img={session?.user?.image ?? ''}
              rounded
            />
          }>
          <Dropdown.Header>
            <span className="block text-sm">{session?.user?.name ?? ''}</span>
            <span className="block truncate text-sm font-medium">
              {session?.user?.email ?? ''}
            </span>
          </Dropdown.Header>
          {/* <Navbar.Link href="#">درباره ما</Navbar.Link>
          <Navbar.Link href="#">خدمات</Navbar.Link>
          <Navbar.Link href="#">قیمت ها</Navbar.Link>
          <Navbar.Link href="#">تماس با ما</Navbar.Link>
          <Dropdown.Divider /> */}
          <Dropdown.Item>
            <Navbar.Link href="/profile">پنل کاربری</Navbar.Link>
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
}
