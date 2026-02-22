CREATE TABLE `form_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`form_data` text NOT NULL,
	`ip` text,
	`created_at` integer,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
