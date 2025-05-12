'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  username: z.string().min(2, { message: 'Username field cannot be empty' }).max(50),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  role: z.enum(['Admin', 'User'], { required_error: 'Please select a role' }),
});

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await axiosInstance.post('/api/auth/register', values);

      if (data.id) {
        toast.success('Successfully registered');
        router.replace('/login');
      }
    } catch (error) {
      toast.error('Failed to register, please try again');
    }
  }

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>
          <div className='flex justify-center items-center'>
            <Image src='/logoipsum.svg' alt='logo' width={1080} height={1080} className='w-36' />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='Input username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl className='relative'>
                    <div>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Input password'
                        className='pr-10'
                        {...field}
                      />
                      {showPassword ? (
                        <Eye
                          size={20}
                          className='absolute top-2 right-2 cursor-pointer'
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <EyeOff
                          size={20}
                          className='absolute top-2 right-2 cursor-pointer text-gray-400'
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='User'>User</SelectItem>
                      <SelectItem value='Admin'>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={form.formState.isSubmitting}
              type='submit'
              className='w-full disabled:opacity-50'>
              {form.formState.isSubmitting ? 'Loading...' : 'Register'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className='text-center text-sm w-full'>
          Already have an account?{' '}
          <a
            href='/login'
            className='font-semibold text-blue-500 underline cursor-pointer underline-offset-2'>
            Login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
