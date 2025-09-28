CREATE TABLE `query_analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`query` text NOT NULL,
	`params` text NOT NULL,
	`execution_plan` text NOT NULL,
	`has_table_scan` integer NOT NULL,
	`has_index_usage` integer NOT NULL,
	`execution_time` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `query_analyses_query_idx` ON `query_analyses` (`query`);--> statement-breakpoint
CREATE INDEX `query_analyses_has_table_scan_idx` ON `query_analyses` (`has_table_scan`);--> statement-breakpoint
CREATE INDEX `query_analyses_execution_time_idx` ON `query_analyses` (`execution_time`);--> statement-breakpoint
CREATE INDEX `query_analyses_created_at_idx` ON `query_analyses` (`created_at`);