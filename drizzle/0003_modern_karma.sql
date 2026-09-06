ALTER TABLE `orders` DROP INDEX `orders_stripePaymentIntentId_unique`;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `stripePaymentIntentId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_stripeCheckoutSessionId_unique` UNIQUE(`stripeCheckoutSessionId`);--> statement-breakpoint
CREATE INDEX `idx_payment_intent` ON `orders` (`stripePaymentIntentId`);--> statement-breakpoint
CREATE INDEX `idx_checkout_session` ON `orders` (`stripeCheckoutSessionId`);