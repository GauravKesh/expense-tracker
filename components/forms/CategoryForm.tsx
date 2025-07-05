'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryFormProps {
  onSubmit: (category: { name: string }) => void;
  onCancel: () => void;
}

export default function CategoryForm({ onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    console.log(name)
    e.preventDefault();
    onSubmit({ name });
    setName('');
  };

  return (
    <Card className='bg-gray-50'>
      <CardHeader>
        {/* <CardTitle>Add Category</CardTitle> */}
      </CardHeader>
      <CardContent className='bg-gray-50'>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Category</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}