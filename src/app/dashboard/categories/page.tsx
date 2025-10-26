'use client'

import { 
  Button, 
  Card, 
  Field, 
  Input, 
  Stack,
  Flex,
  Text,
  SimpleGrid,
  Heading,
  Box,
  HStack,
  Badge,
  IconButton,
  Spinner
} from "@chakra-ui/react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ViewCategories = () => {
  const router = useRouter();
  const { data: categories, isLoading, isError, error } = trpc.categories.getAll.useQuery();


  const deleteCategory = trpc.categories.delete.useMutation({
    onSuccess: () => {
      // Option 1: refetch the categories list
      utils.categories.getAll.invalidate();
    },
    onError: (err) => {
      alert(err.message); // or use a toast
    },
  });

  const handleEdit = (id) => {
    router.push(`categories/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    deleteCategory.mutate({ id });
  };

  if (isLoading) return <Spinner size="xl" />;
  if (isError) return <Text color="red.500">{error.message}</Text>;


  return (
    <Flex h="100vh" w="100vw" direction="column" align="center">
      <Heading >All Categories</Heading>
      <SimpleGrid w="90%" columns={{base: "2", md: "3", xl: "4"}} gap={{base:"10px", md:"20px"}}>
        {categories && categories.length > 0 ? (
          categories.map((category) => (


            <Card.Root key={category.id} flexDirection="row" overflow="hidden" maxW={{sm:"xs", md: "sm", xl: "lg"}}>

              <Box>
                <Card.Body>
                  <Card.Title mb="2">{category.name}</Card.Title>
                  <Card.Description >
                    {category.description}
                  </Card.Description>
                </Card.Body>

              </Box>
              <HStack>
                <IconButton 
                  variant="ghost"
                  onClick={() => handleEdit(category.id)}
                >
                  <FaEdit/>
                </IconButton>

                <IconButton
                  variant="ghost"
                  onClick={() => handleDelete(category.id)}
                  isLoading={deleteCategory.isLoading}
                  aria-label="Delete category"
                >
                  <MdDelete />
                </IconButton>
              </HStack>

            </Card.Root>
          ))
        ): (
            <Text>No categories found.</Text>



          )}
      </SimpleGrid>
    </Flex>
  )
}


export default ViewCategories;
