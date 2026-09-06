ALTER TABLE `orders` ADD `stripeSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentPlanId` varchar(100);--> statement-breakpoint
ALTER TABLE `orders` ADD `installments` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `orders` ADD `installmentAmountCents` int;