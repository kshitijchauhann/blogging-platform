'use client'

import { 
  Flex,
  Button
} from "@chakra-ui/react";
 
import { useRouter } from 'next/navigation';
 
const Dashboard = () => {
  const router = useRouter();

  return (
  <Flex>
      <Button onClick={() => router.push('dashboard/posts/new')}>Write Post</Button>
  </Flex>
  )
}

export default Dashboard;
