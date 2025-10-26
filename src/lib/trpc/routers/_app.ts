import { router } from "../init";
import { categoriesRouter} from "./categories";
import {postsRouter} from "./posts";

export const appRouter = router({
  categories: categoriesRouter,
  posts: postsRouter,
})

export type AppRouter = typeof appRouter;


