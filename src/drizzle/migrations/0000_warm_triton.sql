CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`price` float NOT NULL,
	`size` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`quantity` int NOT NULL,
	`image` varchar(255) NOT NULL,
	`priority` int NOT NULL,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
