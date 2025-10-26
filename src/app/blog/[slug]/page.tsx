"use client"
import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Spinner,
  Center,
  Button,
  HStack,
  Tag,
} from "@chakra-ui/react"
import { MdArrowBack } from "react-icons/md"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"

// Import all the same styles from your editor
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const { data: post, isLoading } = trpc.posts.getBySlug.useQuery(slug, {
    enabled: !!slug,
  })

  // Initialize editor with same extensions as your editor
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        horizontalRule: true,
      }),
      Underline,
      Link.configure({ 
        openOnClick: true,
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      TextAlign.configure({ 
        types: ["heading", "paragraph"] 
      }),
      Highlight.configure({ 
        multicolor: true 
      }),
      Typography,
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ 
        nested: true 
      }),
    ],
    editorProps: {
      attributes: {
        class: 'tiptap-content prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
      },
    },
  })

  // Update editor content when post data arrives
  React.useEffect(() => {
    if (editor && post?.content) {
      try {
        // Since your DB stores HTML, set it directly
        editor.commands.setContent(post.content)
      } catch (error) {
        console.error("Error setting editor content:", error)
      }
    }
  }, [editor, post])

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Stack align="center" gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading post...</Text>
        </Stack>
      </Center>
    )
  }

  if (!post) {
    return (
      <Center minH="100vh">
        <Stack align="center" gap={4}>
          <Text fontSize="xl" color="gray.600">Post not found</Text>
          <Button leftIcon={<MdArrowBack />} onClick={() => router.back()}>
            Go Back
          </Button>
        </Stack>
      </Center>
    )
  }

  return (
    <Container maxW="container.lg" >
      <Button 
        mt={4}
        mb={6}
        onClick={() => router.back()}
        variant="solid"
      >
      <MdArrowBack /> 
        Back
      </Button>

      <Box>
        <Stack gap={4} mb={8}>
          <Heading as="h1" size="2xl">
            {post.title}
          </Heading>
          
          <HStack gap={4} color="gray.600">
            <Text fontSize="sm">
              By <strong>{post.author}</strong>
            </Text>
            <Text fontSize="sm">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </HStack>

          {/* Display categories if available */}
          {post.categories && post.categories.length > 0 && (
            <HStack gap={2} flexWrap="wrap">
              {post.categories.map((category: any) => (
                <Tag.Root key={category.id} size="sm" colorScheme="blue">
                  <Tag.Label>{category.name}</Tag.Label>
                </Tag.Root>
              ))}
            </HStack>
          )}
        </Stack>

        {/* Render TipTap content */}
        <Box 
          className="tiptap-post-content"
          sx={{
            '& .ProseMirror': {
              outline: 'none',
              padding: 0,
            },
            // Add additional styling for better readability
            '& p': {
              marginBottom: '1em',
              lineHeight: '1.7',
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: '1.5em',
              marginBottom: '0.5em',
              fontWeight: 'bold',
              lineHeight: '1.3',
            },
            '& h1': { fontSize: '2.5em' },
            '& h2': { fontSize: '2em' },
            '& h3': { fontSize: '1.75em' },
            '& h4': { fontSize: '1.5em' },
            '& ul, & ol': {
              paddingLeft: '1.5em',
              marginBottom: '1em',
            },
            '& li': {
              marginBottom: '0.5em',
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'gray.300',
              paddingLeft: '1em',
              fontStyle: 'italic',
              color: 'gray.700',
              marginY: '1em',
            },
            '& pre': {
              backgroundColor: 'gray.100',
              padding: '1em',
              borderRadius: 'md',
              overflow: 'auto',
              marginY: '1em',
            },
            '& code': {
              backgroundColor: 'gray.100',
              padding: '0.2em 0.4em',
              borderRadius: 'sm',
              fontSize: '0.9em',
            },
            '& pre code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 'md',
              marginY: '1em',
            },
            '& hr': {
              border: 'none',
              borderTop: '2px solid',
              borderColor: 'gray.200',
              marginY: '2em',
            },
            '& a': {
              color: 'blue.600',
              textDecoration: 'underline',
              '&:hover': {
                color: 'blue.700',
              },
            },
            '& mark': {
              backgroundColor: 'yellow.200',
              padding: '0.1em 0.2em',
              borderRadius: 'sm',
            },
          }}
        >
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <Center py={8}>
              <Spinner size="md" />
            </Center>
          )}
        </Box>
      </Box>
    </Container>
  )
}
