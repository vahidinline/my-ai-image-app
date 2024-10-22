import Link from 'next/link';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to My AI Image App</h1>
      <p>Your one-stop solution for AI-generated images</p>
      <div>
        <Link
          href={'/login'}
          className="btn btn-primary"
          style={{ margin: '10px', padding: '10px 20px' }}>
          ورود با اکانت گوگل
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
