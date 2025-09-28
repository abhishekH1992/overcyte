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
