# Technical Interview Exercise - Task List

## Issues Identified and Tasks to Complete (2-hour timeframe)

### 1. Data Validation Issues ✅ COMPLETED
- **Issue**: Hidden `authorId` field in `create-post-form.tsx` (line 61) allows unauthorized post creation
- **Fix**: Remove hidden field, rely on session-based `authorId` from server action
- **Files**: `src/components/create-post-form.tsx`
- **Additional**: Added content length validation (max 5000 characters)

### 2. Database Query Optimization (20 minutes)
- **Issue**: `dashboard-stats.tsx` loads all users/posts instead of using COUNT queries
- **Fix**: Replace `db.select().from(users)` with `db.select({ count: count() }).from(users)`
- **Files**: `src/components/dashboard-stats.tsx`

### 3. Database Indexes (10 minutes)
- **Issue**: Missing indexes for frequently queried fields
- **Fix**: Add indexes for `username`, `authorId`, and `likeCount` in schema
- **Files**: `src/lib/db/schema.ts`, create migration

### 4. React Performance Issues (25 minutes)
- **Issues**: 
  - Expensive computations in `performance-demo-item.tsx` (lines 27-50)
  - Missing memoization in `performance-demo-list.tsx` (lines 29-50)
  - Unnecessary re-renders due to prop passing
- **Fix**: Add `useMemo`, `useCallback`, and `React.memo` optimizations
- **Files**: `src/components/performance-demo-*.tsx`

### 5. Effect Refactoring (20 minutes)
- **Issue**: `registerUser` function in `src/lib/workflows/registration.ts` uses try-catch blocks
- **Fix**: Refactor using Effect for better error handling and composition
- **Files**: `src/lib/workflows/registration.ts`

### 6. Suspense and Transitions (15 minutes)
- **Issue**: Missing loading states and transitions
- **Fix**: Add Suspense boundaries and useTransition for form submissions
- **Files**: Dashboard page, form components

### 7. Sensitive Data Leak (10 minutes)
- **Issue**: `hashedPassword` field exposed in profile update form (line 25 in `profile.ts`)
- **Fix**: Remove `hashedPassword` from form data, handle password updates separately
- **Files**: `src/lib/actions/profile.ts`

### 8. Additional Security Issues ✅ COMPLETED
- **Issue**: Like API route spreads request body into database update (lines 37, 45)
- **Fix**: Remove `...body` spread to prevent injection
- **Files**: `src/app/api/posts/[id]/like/route.ts`

### 9. Unsafe Data Access ✅ COMPLETED
- **Issue**: `post.author?.username` could be undefined when calling `toLowerCase()` in search
- **Fix**: Added proper null checking with `|| false` fallback
- **Files**: `src/components/posts-list.tsx`

### 10. Post Authorization ✅ COMPLETED
- **Issue**: Users could update/delete any post without ownership check
- **Fix**: Added ownership validation in `updatePostAction` and `deletePostAction`
- **Files**: `src/lib/actions/posts.ts`

### 1. Data Validation & Security
- [ ] **Missing input validation in API routes** - `/api/posts/[id]/like/route.ts` doesn't validate request body
- [ ] **SQL injection protection** - Ensure all queries use parameterized statements (Drizzle ORM helps but need to verify)
- [ ] **Sensitive data leak** - `hashedPassword` field exposed in profile update form

### 2. Database Performance
- [ ] **Missing database indexes** - Add indexes for:
  - `users.username` (unique constraint exists but no explicit index)
  - `posts.authorId` (foreign key needs index)
  - `posts.createdAt` (for sorting)
  - `posts.likeCount` (for sorting)
- [ ] **N+1 query problems** - `getUserWithPosts` makes separate queries
- [ ] **Inefficient data loading** - Dashboard loads all posts without pagination

### 3. React Performance Issues
- [ ] **PerformanceDemoList** - Expensive filtering/sorting on every render (5000 items)
- [ ] **PerformanceDemoItem** - Unnecessary re-renders, expensive computations
- [ ] **PostsList** - Complex calculation in filter (1000 iterations per post)
- [ ] **Missing memoization** - Components re-render unnecessarily
- [ ] **No virtualization** - Rendering 5000 items without virtualization

### 4. Effect Refactoring
- [ ] **registerUser function** - Refactor using Effect for:
  - Better error handling
  - Resource management
  - Composition of async operations
  - Transaction-like behavior

### 5. App Router Features
- [ ] **Suspense boundaries** - Add loading states for async components
- [ ] **Transitions** - Implement useTransition for form submissions
- [ ] **Streaming** - Use Suspense for better perceived performance

## Progress Summary
- **Completed**: 4/10 tasks (40%)
- **Remaining**: 6 tasks
- **Time Used**: ~45 minutes
- **Time Remaining**: ~75 minutes

## Total Estimated Time: 2 hours
## Priority Order: Security issues first, then performance, then features
