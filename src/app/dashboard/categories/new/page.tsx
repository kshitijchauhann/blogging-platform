'use client'

import { 
  Button, 
  Card, 
  Field, 
  Input, 
  Stack,
  Flex,
  Text
} from "@chakra-ui/react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'

const CreateCategory = () => {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  // tRPC mutation
  const createCategory = trpc.categories.create.useMutation({
    onSuccess: (data) => {
      console.log('Category created:', data);
      // Reset form
      setCategoryName('');
      setCategoryDescription('');
      // Navigate to categories list
      router.push('/dashboard/categories');
      router.refresh();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    // Call tRPC mutation
    await createCategory.mutateAsync({
      name: categoryName,
      description: categoryDescription || undefined,
    });
  };

  // Generate slug preview
  const slugPreview = categoryName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

  return (
    <Flex h="100vh" w="100vw" direction="column" justify="center" align="center">
      <Card.Root maxW="sm" w="full">
        <Card.Header>
          <Card.Title>Create New Category</Card.Title>
          <Card.Description>
            Fill in the form to create a new category.
          </Card.Description>
        </Card.Header>
        
        <form onSubmit={handleSubmit}>
          <Card.Body>
            <Stack gap="4" w="full">
              {/* Category Name */}
              <Field.Root>
                <Field.Label>Category Name *</Field.Label>
                <Input 
                  value={categoryName} 
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Web Development"
                  disabled={createCategory.isLoading}
                />
                {/* Slug Preview */}
                {categoryName && (
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Slug: {slugPreview || 'invalid-name'}
                  </Text>
                )}
              </Field.Root>

              {/* Category Description */}
              <Field.Root>
                <Field.Label>Category Description</Field.Label>
                <Input 
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Brief description (optional)"
                  disabled={createCategory.isLoading}
                />
              </Field.Root>

              {/* Error Display */}
              {createCategory.error && (
                <Text color="red.500" fontSize="sm">
                  {createCategory.error.message}
                </Text>
              )}
            </Stack>
          </Card.Body>

          <Card.Footer justifyContent="flex-end">
            <Stack direction="row" gap={2}>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
                disabled={createCategory.isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="solid"
                loading={createCategory.isLoading}
                disabled={createCategory.isLoading}
              >
                {createCategory.isLoading ? 'Creating...' : 'Create Category'}
              </Button>
            </Stack>
          </Card.Footer>
        </form>
      </Card.Root>
    </Flex>
  );
};

export default CreateCategory;
