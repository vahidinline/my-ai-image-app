import Image from 'next/image';
import { FC } from 'react';
import Avatar from '../../assets/img/120.png';
// import { Button } from 'flowbite-react';
// import { signOut } from '@/app/auth';
// import { signOut } from '@/app/auth';

// Define type for session props
type ProfileCardProps = {
  session: any;
};

// Define type for session object
type Option = {
  user: {
    name: string;
    image: string;
  };
};

const ProfileCard: FC<ProfileCardProps> = ({ session }) => {
  const userName = session?.user?.name ?? 'Unknown User';
  const userImage = session?.user?.image ?? Avatar;

  return (
    <section className=" flex font-medium items-center justify-center h-screen">
      <div className="w-64 mx-auto  px-8 py-6">
        {/* Header with Time and Icon */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">2d ago</span>
          <span className="text-emerald-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </span>
        </div>

        {/* Profile Image */}
        <div className="mt-6 w-fit mx-auto">
          <Image
            src={userImage}
            alt={`${userName} profile`}
            width={120}
            height={120}
            className="w-28 h-28 rounded-full"
            priority
          />
        </div>

        {/* User Name */}
        <div className="mt-8">
          <h2 className="text-white font-bold text-2xl tracking-wide">
            {userName}
          </h2>
        </div>
        <p className="text-emerald-400 font-semibold mt-2.5">
          وضعیت حساب کاربری: فعال
        </p>

        {/* Storage Progress Bar */}
        <div className="h-1 w-full bg-black mt-8 rounded-full">
          <div className="h-1 rounded-full w-2/5 bg-yellow-500"></div>
        </div>

        {/* Storage Info */}
        <div className="mt-3 text-white text-sm">
          <span className="text-gray-400 font-semibold">اعتبار باقیمانده:</span>
          <span> 40%</span>
        </div>
        {/* <Button onClick={() => signOut()}>Sign out</Button> */}
      </div>
    </section>
  );
};

export default ProfileCard;
