'use client';

import { getCategories } from '@/actions';
import { GlobalContext } from '@/context';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import type { Category } from '@/types';
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
} from '@/components/ui/dialog';
import CategoryForm from './CategoryForm';
import SearchInput from './SearchInput';
import { PaginationWithLinks } from '../ui/pagination-with-links';

export type DialogState = {
  open: boolean;
  id?: string;
  type?: 'create' | 'edit' | 'delete';
  categoryName?: string;
};

const TableCategories = () => {
  const searchParams = useSearchParams();
  const params = searchParams.get('page');
  const currentPage = Number(params) || 1;
  const { categories, setCategories, isSearching } = useContext(GlobalContext);
  const [isDialogOpen, setIsDialogOpen] = useState<DialogState>({
    open: false,
    id: '',
  });

  useEffect(() => {
    (async () => {
      const data = await getCategories(currentPage);
      setCategories(data!);
    })();
  }, [params]);

  return (
    <>
      <SearchInput type='category' setIsDialogOpen={setIsDialogOpen} />

      <Table className='border-t'>
        <TableHeader>
          <TableRow className='bg-gray-100'>
            <TableHead className='w-[225px] py-3'>Category</TableHead>
            <TableHead className='w-[225px]'>Created at</TableHead>
            <TableHead className='w-[225px]'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSearching || (!categories.isSearched && categories.data.length === 0) ? (
            <TableRow>
              <TableCell colSpan={3} className='h-24 text-center'>
                Loading...
              </TableCell>
            </TableRow>
          ) : categories.isSearched && categories.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className='h-24 text-center'>
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories?.data.map((category) => (
              <TableRow key={category.id}>
                <TableCell className='py-8'>
                  <p>{category?.name} </p>
                </TableCell>
                <TableCell>
                  <p>{dayjs(category.createdAt).format('	MMMM D, YYYY h:mm:ss')}</p>
                </TableCell>
                <TableCell>
                  <div className='flex gap-2 items-center justify-center'>
                    <div
                      onClick={() =>
                        setIsDialogOpen({
                          id: category.id,
                          open: true,
                          type: 'edit',
                          categoryName: category.name,
                        })
                      }
                      className='text-blue-600 underline underline-offset-2 cursor-pointer'>
                      Edit
                    </div>
                    <div
                      onClick={() =>
                        setIsDialogOpen({
                          id: category.id!,
                          open: true,
                          type: 'delete',
                          categoryName: category.name,
                        })
                      }
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

      <Dialog open={isDialogOpen.open} onOpenChange={(open) => setIsDialogOpen({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='pb-2'>
              {isDialogOpen.type === 'delete' && 'Delete Category'}
              {isDialogOpen.type === 'edit' && 'Edit Category'}
              {isDialogOpen.type === 'create' && 'Add Category'}
            </DialogTitle>

            {isDialogOpen.type === 'delete' && (
              <DialogDescription>
                Delete category “{isDialogOpen.categoryName}”? This will remove it from master data
                permanently.
              </DialogDescription>
            )}
          </DialogHeader>

          <CategoryForm
            type={isDialogOpen.type}
            categoryId={isDialogOpen?.id!}
            setIsDialogOpen={setIsDialogOpen}
            isDialogOpen={isDialogOpen}
          />
        </DialogContent>
      </Dialog>

      {categories.totalData > 10 && (
        <div className='p-6 border-t'>
          <PaginationWithLinks page={currentPage} pageSize={10} totalCount={categories.totalData} />
        </div>
      )}
    </>
  );
};

export default TableCategories;
