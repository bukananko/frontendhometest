'use client';

import { deleteArticle, getArticles } from '@/actions';
import { GlobalContext } from '@/context';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import SearchInput from './SearchInput';
import { PaginationWithLinks } from '../ui/pagination-with-links';
import { toast } from 'sonner';

const TableArticles = () => {
  const { setArticles, articles, isSearching } = useContext(GlobalContext);
  const [isDialogOpen, setIsDialogOpen] = useState({
    open: false,
    id: '',
  });
  const searchParams = useSearchParams();
  const params = searchParams.get('page');
  const currentPage = Number(params) || 1;
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const data = await getArticles(currentPage, 10);
      console.log(data);
      setArticles({ ...data!, isSearched: false });
    })();
  }, [params]);

  return (
    <>
      <SearchInput type='articles' />
      <Table className='border-t'>
        <TableHeader>
          <TableRow className='bg-gray-100'>
            <TableHead className='w-[225px]'>Thumbnails</TableHead>
            <TableHead className='w-[225px]'>Title</TableHead>
            <TableHead className='w-[225px]'>Category</TableHead>
            <TableHead className='w-[225px]'>Created at</TableHead>
            <TableHead className='w-[225px]'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSearching || (!articles.isSearched && articles.data.length === 0) ? (
            <TableRow>
              <TableCell colSpan={5} className='h-24 text-center'>
                Loading...
              </TableCell>
            </TableRow>
          ) : articles.isSearched && articles.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className='h-24 text-center'>
                No articles found
              </TableCell>
            </TableRow>
          ) : (
            articles?.data.map((article) => (
              <TableRow key={article.id}>
                <TableCell className='flex justify-center items-center'>
                  <div className='rounded-xl overflow-hidden w-15'>
                    <img
                      src={article.imageUrl || 'https://placehold.co/60x60?text=Hello'}
                      alt={article.title}
                      width={60}
                      height={60}
                      className='w-full aspect-square object-cover'
                    />
                  </div>
                </TableCell>
                <TableCell className='max-lg:min-w-[225px]'>
                  <p className='text-left line-clamp-3 px-3 text-balance'>{article.title}</p>
                </TableCell>
                <TableCell>
                  <p>{article.category?.name} </p>
                </TableCell>
                <TableCell>
                  <p>{dayjs(article.createdAt).format('	MMMM D, YYYY h:mm:ss')}</p>
                </TableCell>
                <TableCell>
                  <div className='flex gap-2 items-center justify-center'>
                    <Link
                      className='text-blue-600 underline underline-offset-2'
                      href={`/articles/${article.id}`}>
                      Preview
                    </Link>
                    <Link
                      className='text-blue-600 underline underline-offset-2'
                      href={`/admin/articles/${article.id}/edit`}>
                      Edit
                    </Link>
                    <div
                      onClick={() => setIsDialogOpen({ id: article.id!, open: true })}
                      className='text-red-500 underline underline-offset-2 cursor-pointer'>
                      Delete
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen.open} onOpenChange={(open) => setIsDialogOpen({ open, id: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Articles</DialogTitle>
            <DialogDescription>
              Deleting this article is permanent and cannot be undone. All related content will be
              removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen({ open: false, id: '' })} variant='outline'>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                deleteArticle(isDialogOpen.id);
                toast.success('Article deleted successfully');
                setIsDialogOpen({ open: false, id: '' });
                router.refresh();
              }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {articles.total > 10 && (
        <div className='p-6 border-t'>
          <PaginationWithLinks page={currentPage} pageSize={10} totalCount={articles.total} />
        </div>
      )}
    </>
  );
};

export default TableArticles;
