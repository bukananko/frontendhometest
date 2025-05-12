import TableArticles from '@/components/admin/TableArticles';
import { Suspense } from 'react';

const ArticlesPage = async () => {
  return (
    <section className='m-6 bg-white rounded-md border flex-1'>
      <Suspense fallback={<div>Loading...</div>}>
        <TableArticles />
      </Suspense>
    </section>
  );
};

export default ArticlesPage;
