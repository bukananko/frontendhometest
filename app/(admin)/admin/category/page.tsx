import TableCategories from '@/components/admin/TableCategories';
import { Suspense } from 'react';

const CategoryPage = async () => {
  return (
    <section className='m-6 bg-white rounded-md border flex-1'>
      <Suspense fallback={<div>Loading...</div>}>
        <TableCategories />
      </Suspense>
    </section>
  );
};

export default CategoryPage;
