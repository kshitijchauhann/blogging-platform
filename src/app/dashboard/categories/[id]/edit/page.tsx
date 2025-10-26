'use client'

import { 
  Button, 
  Card, 
  Field, 
  Input, 
  Stack,
  Flex,
  Text,
  Spinner
} from "@chakra-ui/react"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'

const EditCategory = () => {
  const router = useRouter();
  const { id } = useParams();
  const numericId = Number(id);

  // Fetch category by ID
  const { data: category, isLoading, isError, error } = trpc.categories.getById.useQuery( numericId );

  // Local state for form fields
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // Update mutation
  const updateCategory = trpc.categories.update.useMutation({
    onSuccess: (data) => {
      console.log('Category updated:', data);
      router.push('/dashboard/categories');
      router.refresh();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Populate form once data is fetched
  useEffect(() => {
    if (category) {
      setCategoryName(category.name || '');
      setCategoryDescription(category.description || '');
    }
  }, [category]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    await updateCategory.mutateAsync({
      id: numericId,
      name: categoryName,
      description: categoryDescription || undefined,
    });
  };

  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Text color="red.500">{error.message}</Text>
      </Flex>
    );
  }

  // Slug preview
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
          <Card.Title>Edit Category</Card.Title>
          <Card.Description>
            Update category details below.
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
                  disabled={updateCategory.isLoading}
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
                  disabled={updateCategory.isLoading}
                />
              </Field.Root>

              {/* Error Display */}
              {updateCategory.error && (
                <Text color="red.500" fontSize="sm">
                  {updateCategory.error.message}
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
                disabled={updateCategory.isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="solid"
                isLoading={updateCategory.isLoading}
                disabled={updateCategory.isLoading}
              >
                {updateCategory.isLoading ? 'Updating...' : 'Save Changes'}
              </Button>
            </Stack>
          </Card.Footer>
        </form>
      </Card.Root>
    </Flex>
  );
};

export default EditCategory;
