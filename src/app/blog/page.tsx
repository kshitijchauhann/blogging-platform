'use client'
import {
  Flex,
  Heading,
  Badge,
  HStack,
  Spinner,
  Text,
  Box,
  Card,
  SimpleGrid,
  IconButton,
  Drawer,
  VStack,
} from "@chakra-ui/react";
import { MdMenu, MdClose } from "react-icons/md";
import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BlogPage = () => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Fetch posts using tRPC - you'll need to update the router to include categories
  const { data: posts, isLoading: postsLoading, isError: postsError, error: postsErrorData } = trpc.posts.getAll.useQuery({
    status: 'published', // Only show published posts
    limit: 50,
    offset: 0,
  });

  // Fetch categories using tRPC
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery();

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePostClick = (slug: string) => {
    router.push(`/${slug}`);
  };

 

  // Helper function to get category names for a post
  const getCategoryBadges = (post: any) => {
    if (!post.postCategories || post.postCategories.length === 0) {
      return <Badge colorScheme="gray">Uncategorized</Badge>;
    }
    
    return post.postCategories.map((pc: any, index: number) => (
      <Badge key={index} colorScheme="blue" mr="2">
        {pc.category.name}
      </Badge>
    ));
  };

  if (postsLoading) {
    return (
      <Flex h="100vh" w="100vw" justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (postsError) {
    return (
      <Flex h="100vh" w="100vw" justify="center" align="center">
        <Text color="red.500">Error loading posts: {postsErrorData.message}</Text>
      </Flex>
    );
  }

  return (
    <>
      <Flex h="100vh" w="100vw" direction="column" p="6" gap="6">
        <HStack>
          <IconButton
            variant="ghost"
            size="lg"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open categories menu"
          >
            <MdMenu />
          </IconButton>
          <Heading size="2xl">All Blogs</Heading>
        </HStack>

        <SimpleGrid 
          columns={{ base: 1, md: 2, xl: 3 }} 
          gap={{ base: "10px", md: "20px" }}
        >
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Card.Root 
                key={post.id} 
                size={{ base: "sm", md: "lg" }}
                cursor="pointer"
                onClick={() => handlePostClick(post.slug)}
                _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Card.Header>
                  <Heading size="md" noOfLines={2}>{post.title}</Heading>
                </Card.Header>
                <Card.Body color="fg.muted">
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(post.createdAt)} • {post.author}
                  </Text>
                </Card.Body>
                <Card.Footer>
                  {getCategoryBadges(post)}
                </Card.Footer>
              </Card.Root>
            ))
          ) : (
            <Box gridColumn="1 / -1" textAlign="center" py="10">
              <Text color="gray.500">
                No posts found.
              </Text>
            </Box>
          )}
        </SimpleGrid>

        {posts && posts.length > 0 && (
          <HStack justify="center">
            <Text color="gray.600">
              Showing {posts.length} post{posts.length !== 1 ? 's' : ''}
            </Text>
          </HStack>
        )}
      </Flex>

      {/* Categories Drawer */}
      <Drawer.Root 
        open={isDrawerOpen} 
        onOpenChange={(e) => setIsDrawerOpen(e.open)}
        placement="start"
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <HStack justify="space-between" w="full">
                <Heading size="lg">Categories</Heading>
                <Drawer.CloseTrigger asChild>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="Close drawer"
                  >
                    <MdClose />
                  </IconButton>
                </Drawer.CloseTrigger>
              </HStack>
            </Drawer.Header>
            <Drawer.Body>
              {categoriesLoading ? (
                <Flex justify="center" align="center" h="full">
                  <Spinner />
                </Flex>
              ) : categories && categories.length > 0 ? (
                <VStack align="stretch" gap="2">
                  {categories.map((category) => (
                    <Box
                      key={category.id}
                      p="4"
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
                      transition="all 0.2s"
                    >
                      <Heading size="sm" mb="1">{category.name}</Heading>
                      {category.description && (
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {category.description}
                        </Text>
                      )}
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500" textAlign="center">
                  No categories found.
                </Text>
              )}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
};

export default BlogPage;
