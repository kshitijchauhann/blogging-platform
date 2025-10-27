'use client'
import {
  Flex,
  IconButton,
  Heading,
  Button,
  Badge,
  HStack,
  Spacer,
  Spinner,
  Text,
  Box,
  Card,
  SimpleGrid,
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdAdd } from "react-icons/md";
import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';

const Posts = () => {
  const router = useRouter();
  const utils = trpc.useUtils();
  
  // Fetch posts using tRPC
  const { data: posts, isLoading, isError, error } = trpc.posts.getAll.useQuery({
    limit: 50,
    offset: 0,
  });

  const deletePost = trpc.posts.delete.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate();
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'green' : 'gray';
  };

  const handleEdit = (id: number) => {
    router.push(`posts/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
    deletePost.mutate({ id });
  };

  if (isLoading) {
    return (
      <Flex h="100vh" w="100vw" justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex h="100vh" w="100vw" justify="center" align="center">
        <Text color="red.500">Error loading posts: {error.message}</Text>
      </Flex>
    );
  }

  return (
    <Flex h="100vh" w="100vw" direction="column" p="6" gap="6">
      <HStack>
        <Heading size="2xl">All Posts</Heading>
        <Spacer />
        <Button colorScheme="blue" leftIcon={<MdAdd />}>
          Write Post
        </Button>
      </HStack>

      <SimpleGrid 
        columns={{ base: 1, md: 2, xl: 3 }} 
        gap={{ base: "10px", md: "20px" }}
      >
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card.Root key={post.id} size={{ base: "sm", md: "lg" }}>
              <Card.Header>
                <HStack>
                  <Heading size="md" noOfLines={1}>{post.title}</Heading>
                  <Spacer />
                  <HStack>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post.id)}
                      aria-label="Edit post"
                    >
                      <MdEdit />
                    </IconButton>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(post.id)}
                      isLoading={deletePost.isPending}
                      aria-label="Delete post"
                    >
                      <MdDelete />
                    </IconButton>
                  </HStack>
                </HStack>
              </Card.Header>
              <Card.Body color="fg.muted">
                <Text mb="2">
                  <strong>Author:</strong> {post.author}
                </Text>
                <Text mb="2">
                  <strong>Created:</strong> {formatDate(post.createdAt)}
                </Text>
                <Text>
                  <strong>Last Updated:</strong> {formatDate(post.updatedAt)}
                </Text>
              </Card.Body>
              <Card.Footer>
                <Badge colorScheme={getStatusColor(post.status)}>
                  {post.status}
                </Badge>
              </Card.Footer>
            </Card.Root>
          ))
        ) : (
          <Box gridColumn="1 / -1" textAlign="center" py="10">
            <Text color="gray.500">
              No posts found. Create your first post!
            </Text>
          </Box>
        )}
      </SimpleGrid>

      {posts && posts.length > 0 && (
        <HStack justify="space-between">
          <Text color="gray.600">
            Showing {posts.length} post{posts.length !== 1 ? 's' : ''}
          </Text>
          <HStack>
            <Button size="sm" variant="outline" disabled>
              Previous
            </Button>
            <Button size="sm" variant="outline">
              Next
            </Button>
          </HStack>
        </HStack>
      )}
    </Flex>
  );
};

export default Posts;
