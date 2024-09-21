'use client';

import { Footer } from 'flowbite-react';

export function SiteFooter() {
  return (
    <Footer container className="fixed bottom-0 left-0 right-0">
      <Footer.Copyright
        href="https://vahidafshari.com"
        by="Vahid Afshari"
        year={2024}
      />
      {/* <Footer.LinkGroup>
        <Footer.Link href="#">About</Footer.Link>
        <Footer.Link href="#">Privacy Policy</Footer.Link>
        <Footer.Link href="#">Licensing</Footer.Link>
        <Footer.Link href="#">Contact</Footer.Link>
      </Footer.LinkGroup> */}
    </Footer>
  );
}
