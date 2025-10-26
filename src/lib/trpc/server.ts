import { createCallerFactory } from '@trpc/server';
import { appRouter } from './routers/_app';
import { createContext } from './context';

const createCaller = createCallerFactory(appRouter);

export const serverClient = createCaller(await createContext());
