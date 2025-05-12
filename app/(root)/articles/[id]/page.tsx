import { axiosInstance } from '@/lib/utils';
import type { Article } from '@/types';
import dayjs from 'dayjs';

import { Navbar } from '@/components/Navbar';
import ArticleCard from '@/components/user/ArticleCard';
import Tiptap from '@/components/Tiptap';

const DetailArticlePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { data: article } = await axiosInstance.get<Article>(`/api/articles/${id}`);
  const { data: otherArticles } = await axiosInstance.get<{ data: Article[] }>(
    `/api/articles?limit=3&category=${article.categoryId}`
  );

  return (
    <>
      <Navbar variant='white' />

      <main>
        <section className='flex justify-center items-center flex-col py-10 space-y-4'>
          <div className='text-sm text-slate-600 space-x-2'>
            <span>{dayjs(article.createdAt).format('MMMM D, YYYY')}</span>
            <span>•</span>
            <span>Created by {article.user?.username}</span>
          </div>
          <h1 className='text-3xl font-semibold text-center'>{article.title}</h1>
        </section>

        <section className='px-5 md:px-40 space-y-10 pb-10'>
          <div>
            <img
              src={article.imageUrl || 'https://placehold.co/600x300?text=Hello+World'}
              alt={article.title}
              width={500}
              height={500}
              className='w-full rounded-xl'
            />
          </div>

          <Tiptap value={article.content} />
        </section>

        <section className='space-y-6 px-5 md:px-40 pt-10 pb-25'>
          <h2 className='text-xl font-bold'>Other Articles</h2>

          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10'>
            {otherArticles.data.length > 0 ? (
              otherArticles.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <p>No articles found</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default DetailArticlePage;
