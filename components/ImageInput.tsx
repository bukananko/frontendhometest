'use client';

import Image from 'next/image';
import { ChangeEvent } from 'react';
import { ImagePlus } from 'lucide-react';
import { Input } from './ui/input';

type Props = {
  value: string;
  onChange: (...event: any[]) => void;
};

const ImageInput = ({ value, onChange, ...props }: Props) => {
  return (
    <div className='space-y-3 w-max'>
      <label htmlFor='file' className={value ? 'hidden' : ''}>
        <Input
          {...props}
          id='file'
          className='hidden'
          type='file'
          accept='image/*'
          onChange={(e) => {
            if (!e.target.files) return;
            onChange(URL.createObjectURL(e.target.files[0]));
          }}
        />

        <div className='w-56 border-2 rounded-xl border-dashed h-41 flex justify-center items-center cursor-pointer flex-col gap-3 bg-white'>
          <div>
            <ImagePlus className='text-slate-500' />
          </div>

          <div>
            <p className='text-slate-500 text-center text-sm underline underline-offset-2'>
              Click to select files
            </p>
            <p className='text-slate-500 text-center text-sm'>Suport File Type : jpg or png</p>
          </div>
        </div>
      </label>

      {value && (
        <div className='w-56 border-2 rounded-xl h-auto p-3 space-y-2'>
          <div>
            <Image
              src={value}
              alt='Post'
              width={600}
              height={600}
              className='w-auto h-auto rounded-md'
            />
          </div>

          <div className='flex items-center gap-2 justify-center'>
            <label
              htmlFor='file'
              className='text-blue-600 underline underline-offset-2 text-sm cursor-pointer'>
              Changes
            </label>
            <div
              onClick={() => {
                onChange(undefined);
              }}
              className='text-red-500 underline underline-offset-2 text-sm cursor-pointer'>
              Delete
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
