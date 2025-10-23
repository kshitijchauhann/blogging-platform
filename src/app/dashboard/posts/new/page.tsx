import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import {
Flex
} from "@chakra-ui/react"
const Editor = () => {
  return (
    <Flex h="100vh" w="100vw">
  <SimpleEditor/>
    </Flex>
  )
}

export default Editor;
