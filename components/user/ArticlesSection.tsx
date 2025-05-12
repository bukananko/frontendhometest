'use client';

import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import ArticleCard from '@/components/user/ArticleCard';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '@/context';
import { useSearchParams } from 'next/navigation';
import { getArticles } from '@/actions';
import ArticleSkeleton from '@/components/user/ArticleSkeleton';

const ArticlesSection = () => {
  const { setArticles, articles, isSearching } = useContext(GlobalContext);
  const searchParams = useSearchParams();
  const params = searchParams.get('page');
  const currentPage = Number(params) || 1;

  useEffect(() => {
    (async () => {
      const data = await getArticles(currentPage);
      setArticles({ ...data!, isSearched: false });
    })();
  }, []);

  return (
    <section className='px-5 md:px-24 py-10 space-y-6'>
      <p>
        Showing : {articles.data.length} of {articles.total} articles
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
        {isSearching || (!articles.isSearched && articles.data.length === 0) ? (
          <ArticleSkeleton total={9} />
        ) : articles.isSearched && articles.data.length === 0 ? (
          <p>No articles found</p>
        ) : (
          articles.data.map((article) => <ArticleCard key={article.id} article={article} />)
        )}
      </div>

      {articles.total > 9 && (
        <div className='md:pt-15 pb-5 md:pb-20'>
          <PaginationWithLinks page={currentPage} pageSize={9} totalCount={articles.total} />
        </div>
      )}
    </section>
  );
};

export default ArticlesSection;
