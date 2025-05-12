'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import TextAlign from '@tiptap/extension-text-align';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

type Props = {
  onChange?: (...event: any[]) => void;
  value?: string;
};

const Tiptap = ({ value, onChange, ...props }: Props) => {
  const editor = useEditor({
    editable: onChange ? true : false,
    extensions: [
      StarterKit,
      Dropcursor,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Type a content…',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: onChange ? 'bg-gray-50 h-109 border p-4 focus:outline-none' : '',
      },
    },
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
  });

  return (
    <div>
      {onChange && <MenuBar editor={editor} />}
      <EditorContent editor={editor} {...props} />
      {onChange && (
        <div className='text-sm p-4 border border-t-0 rounded-b-md bg-white'>
          {value?.replace(/<[^>]+>/g, '').length} Words
        </div>
      )}
    </div>
  );
};

export default Tiptap;
