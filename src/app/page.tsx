"use client"

import {
  Flex,
  Input, 
  InputGroup,
  Box,
  Image,
  Spacer,
  SimpleGrid,
  Card,
  Text,
  Button,
  HStack,
  Badge,
  Heading,
  ButtonGroup, IconButton, Pagination
} from "@chakra-ui/react"

import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { LuSearch } from "react-icons/lu"
const Home = () => {
  return (
  <Flex 
      direction="column" 
      align="center" 
      h="100vh" 
      w="100vw"
    >
      <Flex w="100%" mt="12px" mb="12px">
        <Image ml="8px" mr="10px" h="10" w="10" src="/blogLogo.svg"/>
 <InputGroup mr="8px" startElement={<LuSearch />}>
    <Input size="lg" placeholder="Search blogs" />
  </InputGroup>

      </Flex>
      <Flex w="100%"justify="center">
      <SimpleGrid  ml="8px" mr="8px"columns={{base:"2", md:"3"}} gap="20px">
        <Demo/>
                <Demo/>
        <Demo/>
        <Demo/>
        <Demo/>
        <Demo/>

      </SimpleGrid>
      </Flex>
      <Pagination.Root count={20} pageSize={2} defaultPage={1}>
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(page) => (
            <IconButton variant={{ base: "ghost", _selected: "outline" }}>
              {page.value}
            </IconButton>
          )}
        />

        <Pagination.NextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
    </Flex>
  )
}

const Demo = () => {
  return (
    <Card.Root size="sm" border="hidden" overflow="hidden">
      <Image
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        alt="Green double couch with wooden legs"
      />
      <Card.Body>
        <Flex direction="column" w="100%">
        <Text textStyle="xs" fontWeight="medium" color="gray" >Alex Wilson - 17 Jan 2025</Text>
        <Card.Title>Living room Sofa</Card.Title>
        <Card.Description>
          This sofa is perfect for modern tropical spaces, baroque inspired
          spaces.
        </Card.Description>

        </Flex>
      </Card.Body>
      <Card.Footer >
        <HStack>
          <Badge>Default</Badge>
      <Badge colorPalette="green">Success</Badge>
      <Badge colorPalette="red">Removed</Badge>
      <Badge colorPalette="purple">New</Badge>
        </HStack>
      </Card.Footer>
    </Card.Root>
  )
}

export default Home;
