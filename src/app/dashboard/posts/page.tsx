'use client'

import {
  Flex,
  IconButton,
  Heading,
  Table,
  Text,
  Button,
  Badge,
  HStack,
  Spacer,
  Dialog,
  CloseButton,
  Portal
} from "@chakra-ui/react";

import { MdDelete, MdEdit } from "react-icons/md";

const Posts = () => {
  const posts = [
    {
      id: 1,
      title: "How to Learn React in 2025",
      category: "Programing",
      status: (<Badge>Draft</Badge>),
      author: "John Doe",
      createdOn: "2025-10-10",
    },
    {
      id: 2,
      title: "Designing with Chakra UI",
      category: "Design",
      status: (<Badge>Draft</Badge>),
      author: "Jane Smith",
      createdOn: "2025-10-15",
    },
    {
      id: 3,
      title: "Next.js Server Actions Explained",
      category: "Development",
      status: (<Badge>Draft</Badge>),
      author: "Alex Johnson",
      createdOn: "2025-10-20",
    },
  ];

  return (
    <Flex h="100vh" w="100vw" direction="column" p="6" gap="4">
      <HStack >
        <Heading size="2xl">All Posts</Heading>
        <Spacer/>
        <Button>
          Write Post
        </Button>
      </HStack>

      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Title</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Authored By</Table.ColumnHeader>
            <Table.ColumnHeader>Created On</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {posts.map((post) => (
            <Table.Row key={post.id}>
              <Table.Cell>{post.title}</Table.Cell>
              <Table.Cell>{post.category}</Table.Cell>
              <Table.Cell>{post.status}</Table.Cell>
              <Table.Cell>{post.author}</Table.Cell>
              <Table.Cell>
                {new Date(post.createdOn).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell textAlign="end">
                <Flex justify="end" gap="2">
                  <IconButton size="xs" variant="outline" colorPalette="blue">
                    <MdEdit/>
                  </IconButton>
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <IconButton size="xs" variant="outline" colorPalette="red">
                        <MdDelete/> 
                      </IconButton>
                    </Dialog.Trigger>
                    <Portal>
                      <Dialog.Backdrop />
                      <Dialog.Positioner>
                        <Dialog.Content>
                          <Dialog.Header>
                            <Dialog.Title>Are you sure you wanna delete</Dialog.Title>
                          </Dialog.Header>
                          <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button>Delete</Button>
                          </Dialog.Footer>
                          <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                          </Dialog.CloseTrigger>
                        </Dialog.Content>
                      </Dialog.Positioner>
                    </Portal>
                  </Dialog.Root>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>


    </Flex>
  );
};




export default Posts;
