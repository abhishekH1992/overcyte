CREATE TABLE `post_likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`post_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `post_likes_user_id_idx` ON `post_likes` (`user_id`);--> statement-breakpoint
CREATE INDEX `post_likes_post_id_idx` ON `post_likes` (`post_id`);--> statement-breakpoint
CREATE INDEX `post_likes_user_post_idx` ON `post_likes` (`user_id`,`post_id`);