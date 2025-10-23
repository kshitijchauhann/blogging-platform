'use client'

import { 
  Button, 
  Card, 
  Field, 
  Input, 
  Stack,
  Flex
} from "@chakra-ui/react"
import { useState } from 'react'

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    console.log({
      name: categoryName,
      description: categoryDescription,
    });
  };

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
              <Field.Root>
                <Field.Label>Category Name</Field.Label>
                <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Category Description</Field.Label>
                <Input 
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
              </Field.Root>
            </Stack>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Button type="submit" variant="solid">Save</Button>
          </Card.Footer>
        </form>
      </Card.Root>
    </Flex>
  );
};

export default CreateCategory;
