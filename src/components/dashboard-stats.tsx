import { db } from '@/lib/db';
import { users, posts } from '@/lib/db/schema';
import { sum, count } from 'drizzle-orm';
import { formatCount } from '@/lib/utils/format';

async function getTotalUsers() {
  const [result] = await db.select({ count: count() }).from(users);
  return result.count;
}

async function getTotalPosts() {
  const [result] = await db.select({ count: count() }).from(posts);
  return result.count;
}

async function getTotalLikes() {
  const [result] = await db.select({ total: sum(posts.likeCount) }).from(posts);
  return result.total || 0;
}

export async function DashboardStats() {
  const totalUsers = await getTotalUsers();
  const totalPosts = await getTotalPosts();
  const totalLikes = await getTotalLikes();

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900">Users</h3>
        <p className="text-2xl font-bold text-blue-700">{formatCount(totalUsers)}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900">Posts</h3>
        <p className="text-2xl font-bold text-green-700">{formatCount(totalPosts)}</p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-red-900">Likes</h3>
        <p className="text-2xl font-bold text-red-700">{formatCount(Number(totalLikes))}</p>
      </div>
    </div>
  );
}