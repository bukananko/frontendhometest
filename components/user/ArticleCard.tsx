'use client';

import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Article } from '@/types';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

type Props = {
  article: Article;
};

const ArticleCard = ({ article }: Props) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/articles/${article.id}`)}
      className='lg:w-[390px] border-none md:shadow-none py-0 gap-4 cursor-pointer'>
      <CardHeader className='w-full px-0'>
        <img
          src={article.imageUrl || 'https://placehold.co/600x400?text=Hello+World'}
          alt={article.title}
          width={500}
          height={500}
          className='w-full rounded-xl'
        />
      </CardHeader>

      <div className='space-y-2'>
        <div className='text-slate-600 text-sm'>
          {dayjs(article.createdAt).format('MMMM D, YYYY')}
        </div>
        <h2 className='font-semibold text-lg'>{article.title}</h2>
        <p className='text-slate-600 line-clamp-2'>{article.content.replace(/<[^>]+>/g, '')}</p>
      </div>

      <CardFooter className='w-full px-0'>
        <div className='text-sm text-blue-900 bg-blue-200 rounded-full py-1 px-3'>
          {article.category?.name}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
