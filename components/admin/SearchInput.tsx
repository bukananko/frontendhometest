'use client';

import { findArticleByTitle, findCategoryByName } from '@/actions';
import { Input } from '@/components/ui/input';
import { GlobalContext } from '@/context';
import { Plus, Search } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { DialogState } from './TableCategories';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  type: 'category' | 'articles';
  setIsDialogOpen?: React.Dispatch<React.SetStateAction<DialogState>>;
};

const SearchInput = ({ type, setIsDialogOpen }: Props) => {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [value] = useDebounce(text, 500);
  const { setArticles, setIsSearching, articles, setCategories, categories } =
    useContext(GlobalContext);

  useEffect(() => {
    if (!value && !category) return;
    (async () => {
      try {
        setIsSearching(true);

        if (type === 'articles') {
          const response = await findArticleByTitle(value, category);
          setArticles({
            ...response!,
            isSearched: true,
            total: response!.data.length,
            data: response!.data,
          });
        } else {
          const response = await findCategoryByName(value);
          const filteredCategories = response.data.filter((category: any) =>
            category.name.toLowerCase().includes(value.toLowerCase())
          );
          setCategories({
            ...response,
            isSearched: true,
            totalData: response.data.length,
            data: filteredCategories,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSearching(false);
      }
    })();
  }, [category, value]);

  return (
    <>
      <div className='p-6 font-medium capitalize'>
        Total {type} : {type === 'articles' ? articles.total : categories?.data.length}
      </div>

      <div className='flex justify-between items-center px-6 pb-6 border-t'>
        <div className='p-2.5 rounded-xl flex gap-2 max-md:flex-col max-md:w-full'>
          {type === 'articles' && (
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className='w-full md:w-44 bg-white'>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                {categories?.data.map((category) => (
                  <SelectItem key={category.id} value={category.id || 'goblok'}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className='relative'>
            <Input
              placeholder={type === 'articles' ? 'Search by title' : 'Search Category'}
              className='bg-white md:w-96 pl-8'
              onChange={(e) => setText(e.target.value)}
            />
            <Search size={20} className='absolute left-2 top-2 text-gray-500' />
          </div>
        </div>

        {type === 'articles' ? (
          <Button onClick={() => router.push('/admin/articles/new')}>
            <Plus />
            Add Articles
          </Button>
        ) : (
          <Button
            onClick={() => setIsDialogOpen && setIsDialogOpen({ open: true, type: 'create' })}>
            <Plus />
            Add Category
          </Button>
        )}
      </div>
    </>
  );
};

export default SearchInput;
