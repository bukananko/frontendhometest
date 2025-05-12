'use client';

import Image from 'next/image';
import { LogOut, Newspaper, Tag } from 'lucide-react';
import { logout } from '@/actions';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const AdminSidebar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const path = usePathname();
  const router = useRouter();
  const items = [
    {
      title: 'Articles',
      url: '/admin/articles',
      icon: Newspaper,
    },
    {
      title: 'Category',
      url: '/admin/category',
      icon: Tag,
    },
  ];

  return (
    <>
      <Sidebar>
        <SidebarContent className='bg-blue-600 text-white px-4 py-7.5'>
          <SidebarGroup className='space-y-5'>
            <SidebarGroupLabel>
              <Link href='/'>
                <Image
                  src='/logoipsum.svg'
                  alt='logo'
                  width={134}
                  height={134}
                  className='saturate-0 invert'
                />
              </Link>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className='space-y-2'>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={path.includes(item.url) ? 'bg-blue-500' : ''}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className='cursor-pointer'
                    asChild
                    onClick={() => {
                      setIsDialogOpen(true);
                    }}>
                    <div>
                      <LogOut />
                      <span>Logout</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

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
                toast.success('Logout successfully');
                setIsDialogOpen(false);
                router.push('/login');
              }}>
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSidebar;
