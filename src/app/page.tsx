"use client"
import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  Icon,
  SimpleGrid,
  VStack,
  HStack,
  Link,
  Image
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <VStack
      bg="white"
      p={8}
      rounded="lg"
      shadow="md"
      align="start"
      spacing={4}
      transition="all 0.3s"
      _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
    >
      <Box fontSize="40px">{icon}</Box>
      <Heading size="md" color="gray.800">
        {title}
      </Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  );
};

const LandingPage = () => {
  const router = useRouter();
  return (
    <Box>
      {/* Navigation */}
      <Box
        as="nav"
        position="sticky"
        top={0}
        zIndex={10}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        shadow="sm"
      >
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <HStack>
                      <Image h="10" src="/blogLogo.svg"/>

            <Heading size="lg">
              BlogHub
            </Heading>
            </HStack>
                        <HStack spacing={4}>
              <Button colorScheme="blue">Get Started</Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        bgGradient="linear(to-br, blue.50, purple.50)"
        py={{ base: 20, md: 32 }}
      >
        <Container maxW="container.xl">
          <Stack
            spacing={8}
            align="center"
            textAlign="center"
            maxW="3xl"
            mx="auto"
          >
            <Heading
              as="h1"
              size="3xl"
              lineHeight="1.2"
              color="gray.800"
              fontWeight="bold"
            >
              Share Your Stories with the World
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              A powerful blogging platform built for writers, creators, and
              thinkers. Create beautiful posts, organize with categories, and
              reach your audience effortlessly.
            </Text>
            <HStack spacing={4} pt={4}>
              <Button colorScheme="blue" size="lg" px={8}>
                Start Writing
              </Button>
              <Button variant="outline" colorScheme="blue" size="lg" px={8}>
                Learn More
              </Button>
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" py={20} bg="gray.50">
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="2xl">
              <Heading as="h2" size="2xl" color="gray.800">
                Everything You Need to Blog
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Powerful features designed to help you create and manage your
                content with ease
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <FeatureCard
                icon="✍️"
                title="Rich Content Editor"
                description="Write with a powerful editor that supports markdown, formatting, and media embeds for stunning blog posts."
              />
              <FeatureCard
                icon="🏷️"
                title="Smart Categories"
                description="Organize your content with flexible categories and tags. Make your posts easy to discover and navigate."
              />
              <FeatureCard
                icon="📱"
                title="Fully Responsive"
                description="Your blog looks perfect on every device. Desktop, tablet, or mobile - your content shines everywhere."
              />
              <FeatureCard
                icon="⚡"
                title="Lightning Fast"
                description="Built on modern technology for blazing fast load times. Your readers won't have to wait."
              />
              <FeatureCard
                icon="🔍"
                title="SEO Optimized"
                description="Built-in SEO best practices help your content rank higher and reach more readers organically."
              />
              <FeatureCard
                icon="📊"
                title="Analytics Ready"
                description="Track your posts' performance with detailed insights. Understand what resonates with your audience."
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        py={20}
        bgGradient="linear(to-r, blue.600, purple.600)"
        color="white"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading as="h2" size="2xl">
              Ready to Start Your Blogging Journey?
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              Join thousands of writers who trust BlogHub to share their stories
              and connect with readers worldwide.
            </Text>
            <Button
              size="lg" 
              colorScheme="whiteAlpha"
              px={12} 
              py={6}
               onClick={() => router.push('/dashboard/posts/new')}
            >

              Create Your Blog Now
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="gray.800" color="white" py={12}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
            <VStack align="start" spacing={4}>
              <Heading size="md" color="blue.400">
                BlogHub
              </Heading>
              <Text color="gray.400" fontSize="sm">
                Empowering writers to share <br/>their stories with the world.
              </Text>
            </VStack>

            <VStack align="start" spacing={3}>
              <Heading size="sm" mb={2}>
                Product
              </Heading>
              <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                Features
              </Link>
              <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                Pricing
              </Link>
              <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                FAQ
              </Link>
            </VStack>

            <VStack align="start" spacing={3}>
              <Heading size="sm" mb={2}>
                Company
              </Heading>
              <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                About
              </Link>
              <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                Blog
              </Link>
              <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                Careers
              </Link>
            </VStack>

            <VStack align="start" spacing={3}>
              <Heading size="sm" mb={2}>
                Support
              </Heading>
              <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                Help Center
              </Link>
              <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                Contact
              </Link>
              <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                Privacy
              </Link>
            </VStack>
          </SimpleGrid>

          <Box
            mt={12}
            pt={8}
            borderTop="1px"
            borderColor="gray.700"
            textAlign="center"
          >
            <Text color="gray.400" fontSize="sm">
              © 2025 BlogHub. All rights reserved.
            </Text>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
