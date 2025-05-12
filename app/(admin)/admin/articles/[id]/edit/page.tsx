import ArticleForm from '@/components/admin/ArticleForm';

const EditArticlePage = async () => {
  return (
    <section className='m-6 bg-gray-50 rounded-md border flex-1'>
      <ArticleForm type='edit' />
    </section>
  );
};

export default EditArticlePage;
