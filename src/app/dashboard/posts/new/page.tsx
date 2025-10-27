"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import { MdSave } from "react-icons/md"

import { useCurrentEditor } from "@tiptap/react"

import { 
  CloseButton, 
  Dialog, 
  Portal,
  Steps,
  Button as CButton,
  ButtonGroup,
  Field,
  Input,
  Stack,
  HStack,
  Text,
  NativeSelect,
  Box,
  Spacer as CSpacer,
  Tag
} from "@chakra-ui/react"

import { trpc } from '@/lib/trpc/client';

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  onDialogOpen,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
  onDialogOpen: () => void
}) => {
  const { editor } = useCurrentEditor()
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup data-variant="floating">
        <Button
          style={{
            backgroundColor: "black",
            color: "white"
          }}
          onClick={() => {
            const content = editor?.getJSON()
            console.log('Saving:', content)
            onDialogOpen()
          }}
        >
          <MdSave />
          <span style={{
            fontSize: '10px'
          }}>Save</span>
        </Button>
      </ToolbarGroup>

      <Spacer />
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

function SimpleEditor({ onDialogOpen, editorRef }: { onDialogOpen: () => void, editorRef: React.MutableRefObject<any> }) {
  const isMobile = useIsMobile()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
    ],
  })

  // Expose editor to parent via ref
  React.useEffect(() => {
    if (editor && editorRef) {
      editorRef.current = editor
    }
  }, [editor, editorRef])

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            backgroundColor: 'white',
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              onDialogOpen={onDialogOpen}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  )
}


export default function EditorWithDialog() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [authorName, setAuthorName] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [selectedCategories, setSelectedCategories] = React.useState([])
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSaving, setIsSaving] = React.useState(false)
  const editorRef = React.useRef(null)
  
  // Fetch categories using tRPC
  const { data: categories, isLoading, isError } = trpc.categories.getAll.useQuery()
  
  // Create post mutation
  const createPostMutation = trpc.posts.create.useMutation()
  
  // Add categories mutation
  const addCategoriesMutation = trpc.posts.addCategories.useMutation()

  const handleCategorySelect = (value) => {
    console.log("Selected value:", value)
    console.log("Categories data:", categories)
    console.log("Current selectedCategories:", selectedCategories)
    
    setCategory(value)
    
    if (value && !selectedCategories.some(cat => cat.id === Number(value))) {
      const selectedCategory = categories?.find(cat => cat.id === Number(value))
      console.log("Found category:", selectedCategory)
      
      if (selectedCategory) {
        const newSelected = [...selectedCategories, selectedCategory]
        console.log("New selectedCategories:", newSelected)
        setSelectedCategories(newSelected)
      } else {
        console.log("Category not found in categories array")
      }
    } else {
      console.log("Value is empty or already selected")
    }
    
    setCategory("")
  }

  const handleSubmit = async (status) => {
    if (!authorName.trim()) {
      alert("Please enter author's name")
      return
    }

    setIsSaving(true)
    
    try {
      // Get editor content
      const editorContent = editorRef.current?.getJSON()
      const editorHTML = editorRef.current?.getHTML()
      
      // Extract title from first heading or use fallback
      let title = "Untitled Post"
      if (editorContent?.content) {
        const firstHeading = editorContent.content.find(
          node => node.type === 'heading'
        )
        if (firstHeading?.content?.[0]?.text) {
          title = firstHeading.content[0].text
        }
      }
      
      // Create post
      const newPost = await createPostMutation.mutateAsync({
        title,
        content: editorHTML || "",
        author: authorName,
        status: status || 'draft',
      })
      
      // Add categories if any selected
      if (selectedCategories.length > 0) {
        await addCategoriesMutation.mutateAsync({
          postId: newPost.id,
          categoryIds: selectedCategories.map(cat => cat.id),
        })
      }
      
      console.log('Post saved successfully:', newPost)
      alert(`Post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`)
      
      // Reset form
      setIsDialogOpen(false)
      setAuthorName("")
      setSelectedCategories([])
      setCurrentStep(0)
      
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const removeCategory = (categoryToRemove) => {
    setSelectedCategories(selectedCategories.filter(cat => cat.id !== categoryToRemove.id))
  }
  
  return (
    <>
      <SimpleEditor onDialogOpen={() => setIsDialogOpen(true)} editorRef={editorRef} />
      <Dialog.Root size="cover" open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Save Confirmation</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <Steps.Root 
                  h="100%"
                  step={currentStep} 
                  count={steps.length - 1}
                  onStepChange={(e) => setCurrentStep(e.step)}
                >
                  {/* Show only current step title */}
                  <Box mb={6}>
                    <Text fontSize="xl" fontWeight="semibold">
                      {steps[currentStep]?.title}
                    </Text>
                  </Box>
                  
                  <Steps.Content index={0}>
                    <Field.Root>
                      <Field.Label>Author's Name</Field.Label>
                      <Input 
                        placeholder="Enter author's name"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                      />
                    </Field.Root>
                  </Steps.Content>
                  
                  <Steps.Content index={1}>
                    <Stack direction="column" gap={4}>
                      <Field.Root>
                        <Field.Label>Select Category</Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field 
                            value={category}
                            onChange={(e) => handleCategorySelect(e.target.value)}
                            disabled={isLoading}
                          >
                            <option value="">
                              {isLoading ? "Loading categories..." : "Choose a category"}
                            </option>
                            {isError && (
                              <option value="" disabled>Error loading categories</option>
                            )}
                            {categories && categories.map((cat) => (
                              <option 
                                key={cat.id} 
                                value={cat.id}
                                disabled={selectedCategories.some(selected => selected.id === cat.id)}  
                              >
                                {cat.name}
                              </option>
                            ))}
                          </NativeSelect.Field>
                        </NativeSelect.Root>
                      </Field.Root>
                      
                      {/* Display selected categories as tags */}
                      {selectedCategories.length > 0 && (
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>
                            Selected Categories:
                          </Text>
                          <HStack gap={2} flexWrap="wrap">
                            {selectedCategories.map((cat) => (
                              <Tag.Root key={cat.id} colorScheme="blue">
                                <Tag.Label>{cat.name}</Tag.Label>
                                <Tag.EndElement>
                                  <Tag.CloseTrigger onClick={() => removeCategory(cat)} />
                                </Tag.EndElement>
                              </Tag.Root>
                            ))}
                          </HStack>
                        </Box>
                      )}
                    </Stack>
                  </Steps.Content>
                  
                  <Steps.Content index={2}>
                    <Stack direction="column" gap={4}>
                      <Text>Review your submission and choose how to save:</Text>
                      
                      {/* Show selected data in review */}
                      <Box p={4} borderWidth="1px" borderRadius="md">
                        <Stack gap={2}>
                          <Text><strong>Author:</strong> {authorName || "Not provided"}</Text>
                          <Box>
                            <Text fontWeight="bold">Categories:</Text>
                            {selectedCategories.length > 0 ? (
                              <HStack gap={2} mt={1} flexWrap="wrap">
                                {selectedCategories.map((cat) => (
                                  <Tag.Root key={cat.id} size="sm" colorScheme="blue">
                                    <Tag.Label>{cat.name}</Tag.Label>
                                  </Tag.Root>
                                ))}
                              </HStack>
                            ) : (
                              <Text fontSize="sm" color="gray.500">No categories selected</Text>
                            )}
                          </Box>
                        </Stack>
                      </Box>
                      
                      <HStack gap={3}>
                        <CButton 
                          variant="outline"
                          onClick={() => handleSubmit('draft')}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save as Draft'}
                        </CButton>
                        <CButton 
                          colorScheme="blue"
                          onClick={() => handleSubmit('published')}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Publishing...' : 'Publish'}
                        </CButton>
                      </HStack>
                    </Stack>
                  </Steps.Content>
                  <CSpacer/>
                  <ButtonGroup size="sm" variant="outline" mt={6}>
                    <Steps.PrevTrigger asChild>
                      <CButton>Prev</CButton>
                    </Steps.PrevTrigger>
                    <Steps.NextTrigger asChild>
                      <CButton>Next</CButton>
                    </Steps.NextTrigger>
                  </ButtonGroup>
                </Steps.Root>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}

const steps = [
  { title: "Author Information" },
  { title: "Category Selection" },
  { title: "Publish Options" }
]
