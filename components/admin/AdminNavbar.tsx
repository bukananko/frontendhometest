'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { GlobalContext } from '@/context';

export const AdminNavbar = () => {
  const path = usePathname();
  const router = useRouter();
  const { currentUser } = useContext(GlobalContext);

  return (
    <header
      className={cn(
        `sticky left-0 top-0 right-0 px-6 py-4 flex justify-between items-center z-50 bg-white border-b`
      )}>
      <div className='flex items-center gap-2'>
        <SidebarTrigger />
        <p className='capitalize text-xl font-semibold'>{path.split('/')[2]}</p>
      </div>

      <div
        onClick={() => router.push('/admin/profile')}
        className='flex items-center gap-2 cursor-pointer'>
        <Avatar>
          <AvatarFallback className='text-blue-900'>
            {currentUser?.username ? currentUser.username.slice(0, 1) : 'A'}
          </AvatarFallback>
        </Avatar>
        <p className={cn(`underline underline-offset-2 decoration-1 max-md:hidden text-black`)}>
          {currentUser?.username ?? 'Admin'}
        </p>
      </div>
    </header>
  );
};
