'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '@/context';
import { findArticleByTitle } from '@/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const HeroSection = () => {
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [value] = useDebounce(text, 500);
  const { setArticles, setIsSearching, categories } = useContext(GlobalContext);

  useEffect(() => {
    if (!value && !category) return;
    (async () => {
      try {
        setIsSearching(true);

        const response = await findArticleByTitle(value, category);

        setArticles({
          ...response!,
          isSearched: true,
          total: response!.data.length,
          data: response!.data,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsSearching(false);
      }
    })();
  }, [category, value]);

  return (
    <section className='bghero h-screen max-h-[560px] md:max-h-[500px] flex justify-center items-center flex-col gap-3 px-5'>
      <div className='text-center space-y-3 text-white'>
        <div className='font-bold'>Blog Genzet</div>
        <h1 className='text-4xl md:text-5xl text-center'>
          The Journal : Design Resources,
          <br /> Interviews, and Industry News
        </h1>
        <p className='text-xl md:text-2xl'>Your daily dose of design insights!</p>
      </div>

      <div className='bg-blue-500 p-2.5 rounded-xl flex gap-2 max-md:flex-col max-md:w-full'>
        <Select onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className='w-full md:w-44 bg-white'>
            <SelectValue placeholder='Select Category' />
          </SelectTrigger>
          <SelectContent>
            {categories.data.map((category) => (
              <SelectItem key={category.id} value={category.id || 'goblok'}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='relative'>
          <Input
            placeholder='Search articles'
            className='bg-white md:w-96 pl-8'
            onChange={(e) => setText(e.target.value)}
          />
          <Search size={20} className='absolute left-2 top-2 text-gray-500' />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
