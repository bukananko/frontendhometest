'use client';

import { Toggle } from './ui/toggle';
import type { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image,
  Italic,
  Redo,
  Undo,
} from 'lucide-react';
import { useCallback } from 'react';

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const Options = [
    {
      icon: <Undo className='size-4' />,
      onClick: () => editor.chain().focus().undo().run(),
      preesed: editor.isActive('undo'),
    },
    {
      icon: <Redo className='size-4' />,
      onClick: () => editor.chain().focus().redo().run(),
      preesed: editor.isActive('redo'),
    },
    {
      icon: <Bold className='size-4' />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive('bold'),
    },
    {
      icon: <Italic className='size-4' />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive('italic'),
    },
    {
      icon: <Image className='size-4' />,
      onClick: useCallback(() => {
        const url = window.prompt('Image URL');

        if (url) {
          const alt = window.prompt('Alternative text for image');
          editor.commands.setImage({
            src: url,
            alt: alt || 'Image',
          });
        }
      }, [editor]),
      preesed: editor.isActive('italic'),
    },
    {
      icon: <AlignLeft className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      preesed: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      preesed: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      preesed: editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <AlignJustify className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('justify').run(),
      preesed: editor.isActive({ textAlign: 'justify' }),
    },
  ];

  return (
    <div className='border border-b-0 rounded-t-md p-1 bg-white space-x-1 z-50'>
      {Options.map((option, index) => (
        <Toggle key={index} pressed={option.preesed} onPressedChange={option.onClick}>
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
