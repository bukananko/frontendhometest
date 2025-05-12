import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../ui/input';
import { createCategory, deleteCategory, updateCategory } from '@/actions';
import { DialogState } from './TableCategories';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

type Props = {
  type?: 'create' | 'edit' | 'delete';
  categoryId: string;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<DialogState>>;
  isDialogOpen: DialogState;
};

const CategoryForm = ({ type, categoryId, setIsDialogOpen, isDialogOpen }: Props) => {
  const formSchema = z.object({
    name: z.string({ required_error: 'Category field cannot be empty' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: isDialogOpen.categoryName || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (type === 'create') {
      await createCategory(values);
      toast.success('Category created successfully');
    } else if (type === 'edit') {
      await updateCategory(categoryId, values);
      toast.success('Category updated successfully');
    } else {
      await deleteCategory(categoryId);
      toast.success('Category deleted successfully');
    }

    handleCloseDialog(false);
  }

  const handleCloseDialog = (open: boolean) => {
    setIsDialogOpen({ open });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mb-0'>
        {type !== 'delete' && (
          <FormField
            control={form.control}
            name='name'
            render={({ field: { value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    value={value || ''}
                    placeholder='Input Category'
                    className='bg-white'
                    {...fieldProps}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className='flex w-full justify-end items-center gap-2'>
          <Button
            disabled={form.formState.isSubmitting}
            className='mb-0'
            onClick={() => handleCloseDialog(false)}
            type='button'
            variant='outline'>
            Cancel
          </Button>
          <Button
            disabled={form.formState.isSubmitting}
            type='submit'
            variant={isDialogOpen.type === 'delete' ? 'destructive' : 'default'}>
            {isDialogOpen.type === 'delete' && 'Delete'}
            {isDialogOpen.type === 'edit' && 'Save Changes'}
            {isDialogOpen.type === 'create' && 'Add'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
