import { getProfile } from '@/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ProfilePage = async () => {
  const data = await getProfile();
  return (
    <section className='flex justify-center items-center flex-col gap-9 flex-1 py-10 m-6 bg-white rounded-md md:border'>
      <h1 className='text-xl font-semibold'>User Profile</h1>

      <div>
        <Avatar className='size-17'>
          <AvatarFallback className='text-blue-900 text-2xl'>
            {data?.username.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className='flex flex-col gap-3 w-full md:w-full lg:w-1/2 xl:w-1/3 px-9'>
        <div className='flex justify-between items-center w-full gap-5 bg-gray-100 rounded-md py-2.5 px-3'>
          <span className='flex-1/12 font-semibold'>Username</span>
          <span className=''>:</span>
          <span className='text-center flex-1/3'>{data?.username}</span>
        </div>
        <div className='flex justify-between items-center w-full gap-5 bg-gray-100 rounded-md py-2.5 px-3'>
          <span className='flex-1/12 font-semibold'>Password</span>
          <span className=''>:</span>
          <span className='text-center flex-1/3'>{data?.username}</span>
        </div>
        <div className='flex justify-between items-center w-full gap-5 bg-gray-100 rounded-md py-2.5 px-3'>
          <span className='flex-1/12 font-semibold'>Role</span>
          <span className=''>:</span>
          <span className='text-center flex-1/3'>{data?.role}</span>
        </div>

        <Link href='/admin/articles'>
          <Button className='w-full my-6 py-2.5'>Back to dashboard</Button>
        </Link>
      </div>
    </section>
  );
};

export default ProfilePage;
