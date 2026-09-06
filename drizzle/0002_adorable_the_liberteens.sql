CREATE TABLE `surveyResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderId` int NOT NULL,
	`hadDiscoveryCall` enum('yes','no','scheduled') NOT NULL,
	`additionalResponses` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `surveyResponses_id` PRIMARY KEY(`id`)
);
