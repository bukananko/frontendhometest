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
import { setCookie } from '@/actions';
import { axiosInstance } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

const formSchema = z.object({
  username: z.string().min(2, { message: 'Please enter your username' }).max(50),
  password: z.string().min(8, { message: 'Please enter your password' }),
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
      const { data } = await axiosInstance.post('/api/auth/login', values);

      if (data.token) {
        await setCookie('token', data.token);
        await setCookie('role', data.role);
        toast.success('Successfully logged in');
        router.replace(data.role === 'Admin' ? '/admin/articles' : '/');
      }
    } catch (error) {
      toast.error('Failed to login, please try again');
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
                    <Input autoFocus placeholder='Input username' {...field} />
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

            <Button
              disabled={form.formState.isSubmitting}
              type='submit'
              className='w-full disabled:opacity-50'>
              {form.formState.isSubmitting ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className='text-center text-sm w-full'>
          Don't have an account?{' '}
          <a
            href='/register'
            className='font-semibold text-blue-500 underline cursor-pointer underline-offset-2'>
            Register
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
