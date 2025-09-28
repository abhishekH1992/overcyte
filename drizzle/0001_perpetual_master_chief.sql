CREATE INDEX `author_id_idx` ON `posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `like_count_idx` ON `posts` (`like_count`);--> statement-breakpoint
CREATE INDEX `posts_created_at_idx` ON `posts` (`created_at`);--> statement-breakpoint
CREATE INDEX `username_idx` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);