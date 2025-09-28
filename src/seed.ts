import { seed } from "drizzle-seed";
import * as schema from "./lib/db/schema";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

// Use the full schema for seeding
const seedSchema = schema;

type Options = {
  userCount: number;
  postCount: number;
};

export async function seedDatabase(
  database: LibSQLDatabase<typeof schema>,
  opts: Options
) {
  // Clear existing data first to avoid conflicts
  await database.delete(schema.postLikes);
  await database.delete(schema.posts);
  await database.delete(schema.users);
  
  // @ts-ignore
  await seed(database, seedSchema).refine((f) => ({
    users: {
      count: opts.userCount,
      with: {
        posts: opts.postCount,
      },
    },
  }));
}
