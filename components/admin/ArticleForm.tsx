'use client';

import { createArticle, getArticleById, updateArticle } from '@/actions';
import { Article, Category } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import ImageInput from '../ImageInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Tiptap from '../Tiptap';
import {
  Form,
  FormControl,
  FormDescription,
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
import { GlobalContext } from '@/context';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string({ message: 'Please enter title' }).max(50),
  category: z.string({ required_error: 'Please select category' }),
  image: z.string().optional().nullable(),
  content: z.string({ message: 'Content field cannot be empty' }),
});

type Props = {
  type: 'create' | 'edit';
};

const ArticleForm = ({ type }: Props) => {
  const { categories } = useContext(GlobalContext);
  const router = useRouter();
  const [article, setArticle] = useState({} as Article);
  const [savedArticles, setSavedArticles] = useState({} as Article);
  const path = usePathname();
  const id = path.split('/')[3];

  useEffect(() => {
    (async () => {
      if (type === 'edit') {
        const data = await getArticleById(id);
        setArticle(data!);
      }
    })();

    const d = JSON.parse(localStorage.getItem('articles')!);

    if (d?.articleId === id) {
      setSavedArticles(d);
    }
  }, [path]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      title: savedArticles?.title || article?.title,
      content: savedArticles?.content || article?.content,
      category: savedArticles?.category?.id || article.category?.id!,
      image: savedArticles?.imageUrl || article?.imageUrl,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (type === 'create') {
      await createArticle(values);
      toast.success('Article created successfully');
    } else if (type === 'edit') {
      await updateArticle(id, values);
      toast.success('Article updated successfully');
    }
    localStorage.clear();
    router.back();
  }

  return (
    <div className='p-5 space-y-10'>
      <div onClick={() => router.back()} className='flex gap-2 items-center cursor-pointer'>
        <ArrowLeft />
        <p className='font-medium capitalize'>{type} Articles</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='image'
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Thumbnails</FormLabel>
                <FormControl>
                  <ImageInput value={value || ''} onChange={onChange} {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='title'
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Input title'
                    className='bg-white'
                    value={value || ''}
                    onChange={onChange}
                    {...fieldProps}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='category'
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={onChange} value={value || ''}>
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.data.map((category) => (
                      <SelectItem key={category.id} value={category?.id || 'goblok'}>
                        {category?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The existing category list can be seen in the{' '}
                  <Link
                    href='/admin/category'
                    className='text-blue-600 underline underline-offset-2'>
                    category
                  </Link>{' '}
                  menu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='content'
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  {savedArticles.content || value ? (
                    <Tiptap value={value || ''} onChange={onChange} {...fieldProps} />
                  ) : (
                    type === 'create' && (
                      <Tiptap value={value || ''} onChange={onChange} {...fieldProps} />
                    )
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-end items-center gap-2'>
            <Button
              disabled={form.formState.isSubmitting}
              type='button'
              variant='outline'
              onClick={() => {
                router.back();
                localStorage.clear();
              }}>
              Cancel
            </Button>
            <Button
              disabled={form.formState.isSubmitting}
              type='button'
              className='bg-slate-200 text-black'
              onClick={() => {
                localStorage.setItem(
                  'articles',
                  JSON.stringify({
                    articleId: id,
                    content: form.getValues('content'),
                    title: form.getValues('title'),
                    imageUrl: form.getValues('image'),
                    categoryId: form.getValues('category'),
                  })
                );
                router.push('/preview');
              }}
              variant='secondary'>
              Preview
            </Button>
            <Button disabled={form.formState.isSubmitting} type='submit'>
              Upload
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ArticleForm;
