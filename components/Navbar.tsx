'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getProfile, logout } from '@/actions';
import type { User as UserType } from '@/types';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

type Props = {
  variant: 'transparent' | 'white';
  isAdmin?: boolean;
};

export const Navbar = ({ variant = 'transparent' }: Props) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState({} as UserType);

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      setCurrentUser(data!);
    })();

    const handleScroll = () => {
      setIsScrolled(Number(window.scrollY) > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        `fixed max-md:sticky left-0 top-0 right-0 px-5 md:px-24 py-4 flex justify-between items-center bg-transparent z-50`,
        isScrolled && variant === 'transparent' ? 'bg-white' : '',
        variant === 'white' ? 'sticky bg-white border-b' : ''
      )}>
      <div onClick={() => router.push('/')} className='cursor-pointer'>
        <Image
          src='/logoipsum.svg'
          alt='logo'
          width={134}
          height={134}
          className={cn(
            'saturate-0 invert max-md:saturate-100 max-md:invert-0',
            isScrolled && variant === 'transparent' ? 'saturate-100 invert-0' : '',
            variant === 'white' ? 'saturate-100 invert-0' : ''
          )}
        />
      </div>

      {currentUser?.id ? (
        <DropdownMenu>
          <DropdownMenuTrigger className='cursor-pointer'>
            <div className='flex items-center gap-2'>
              <Avatar>
                <AvatarFallback className='text-blue-900'>
                  {currentUser?.username.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <p
                className={cn(
                  `underline underline-offset-2 decoration-1 max-md:hidden`,
                  isScrolled && variant === 'transparent' ? 'text-black' : 'text-white',
                  variant === 'white' ? 'text-black' : ''
                )}>
                {currentUser?.username}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='mr-5'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {currentUser?.role === 'Admin' && (
              <DropdownMenuItem onClick={() => router.push('/admin/articles')}>
                <LayoutDashboard />
                Dashboard
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsDialogOpen(true);
              }}
              className='text-red-500'>
              <LogOut className='text-red-500' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href='/login'
          className={cn(
            `underline underline-offset-2 decoration-1 max-md:text-black`,
            isScrolled && variant === 'transparent' ? 'text-black' : 'text-white',
            variant === 'white' ? 'text-black' : ''
          )}
          onClick={(e) => e.stopPropagation()}>
          Login
        </Link>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>Are you sure want to logout?</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant='outline'>
              Cancel
            </Button>
            <Button
              onClick={() => {
                logout();
                setIsDialogOpen(false);
                setCurrentUser({} as UserType);
                toast.success('Successfully logged out');
                router.push('/login');
              }}>
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};
