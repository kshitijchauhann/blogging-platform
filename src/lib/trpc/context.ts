
import { db } from '@/lib/db';

export async function createContext() {
  return { db };
}
