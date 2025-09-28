## Exercise 2025

### Requirements

- Node 22.x
- pnpm

### Run

```bash
git clone https://github.com/abhishekH1992/overcyte.git
cd overcyte
pnpm i
pnpm db:migrate
pnpm db:seed
pnpm dev
```

### Tasks

These tasks aren't leetcode, nor are they difficult. Simple things that show an attention to detail and baseline knowledge of Next, React, Drizzle and Effect.

1. Identify and fix issues where data is not validated or checked before it gets used
   - there are no SQL injections
2. Identify and fix poor database queries and poor data loading patterns
   - while not much of an issue with local sqlite, implement correct indexes
3. Identify and fix poor React performance
4. Refactor the `registerUser` function using [Effect](https://effect.website/).
   - this doesn't need to be perfect, nor use the full Effect toolbox. just a basic understanding of what Effect provides
5. Implement App Router/React features in places that need it, such as suspense and transitions
6. Identify and fix a sensitive data leak issue

Corners have been cut for the sake of boilerplate, and are not issues to be fixed:

- Weak auth system
- `process.env` for environment variables instead of proper server/client separation.

### Issues Fixed

| Issue | Significance | Solution |
|-------|-------------|----------|
| **Hidden authorId field** | Security vulnerability allowing unauthorized post creation | Removed hidden field, rely on session-based authorId from server action |
| **Dashboard stats inefficiency** | Loading all users/posts instead of using COUNT queries | Replaced `db.select().from(users)` with `db.select({ count: count() }).from(users)` |
| **Missing database indexes** | Poor query performance on frequently accessed fields | Added indexes for `username`, `authorId`, `likeCount`, and composite indexes for `postLikes` |
| **React performance issues** | Expensive computations and unnecessary re-renders | Added `useMemo`, `useCallback`, and `React.memo` optimizations |
| **Effect refactoring** | Poor error handling with try-catch blocks | Refactored `registerUser` using Effect for better error handling and composition |
| **Missing loading states** | Poor UX with no loading feedback | Added Suspense boundaries and `useActionState` with `isPending` for form submissions |
| **Sensitive data leak** | `hashedPassword` exposed in profile update form | Removed `hashedPassword` from form data, handle password updates separately |
| **API route security** | Request body spread into database update | Removed `...body` spread to prevent injection attacks |
| **Unsafe data access** | `post.author?.username` could be undefined | Added proper null checking with `|| false` fallback |
| **Post authorization** | Users could update/delete any post | Added ownership validation in `updatePostAction` and `deletePostAction` |
| **Input validation** | Missing validation in API routes | Added Zod schema validation for request bodies |
| **Hydration mismatch** | `Math.random()` causing server/client differences | Fixed with deterministic seeded random function |
| **SQL injection protection** | Potential SQL injection vulnerabilities | All queries use parameterized statements via Drizzle ORM |
| **Password validation messages** | Generic error messages for password failures | Added specific error messages for password policy violations |
| **N+1 query verification** | Potential performance issues with user posts | Verified `getUserWithPosts` only makes 2 queries (user + posts) |
| **Dashboard pagination** | Potential inefficient data loading | Verified uses `getPostsWithAuthorsPaginated` with proper pagination |
| **Server-side processing** | Complex client-side filtering causing performance issues | Removed client-side filtering, now uses server-side processing |
| **Virtualization** | Rendering too many items at once | Added pagination to limit rendered items |
| **Effect error handling** | Poor error handling with try-catch blocks | Used Effect.tryPromise and Effect.catchAll for better error handling |
| **Effect resource management** | No proper cleanup of resources | Added proper resource management with cleanup |
| **Effect composition** | Sequential async operations | Used Effect.flatMap and Effect.all for composition |
| **Effect transactions** | No transaction-like behavior | Implemented sequential and parallel execution patterns |
| **Suspense boundaries** | Missing loading states for async components | Added Suspense boundaries around DashboardStats and PrefetchedPosts |
| **Form transitions** | No loading feedback during form submissions | Implemented useActionState with isPending for form submissions |
| **Streaming performance** | Poor perceived performance | Used Suspense for better perceived performance with loading components |

### Fair AI Usage

**Note**: AI usage was limited for this test to demonstrate systematic problem-solving approach.

**Methodology:**

1. **Manual Analysis**: Went through each functionality to understand what it's trying to do
2. **Issue Documentation**: Listed all issues by adding them to `TODO.md` as they were discovered
3. **Systematic Fixes**: Fixed issues one by one, using AI for speed up the process with correct prompts
4. **Testing Focus**: Mainly used AI for testing purposes to verify fixes
5. **Progress Tracking**: Used TODO list to mark if issues are fixed or not
6. **Final Verification**: Used TODO list as final checks for AI to verify all recorded issues are fixed and identify any additional issues