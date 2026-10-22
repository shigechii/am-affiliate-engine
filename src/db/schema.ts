import {
  pgTable,
  text,
  varchar,
  integer,
  doublePrecision,
  jsonb,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  provider: varchar("provider", { length: 50 }).notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  affiliateUrl: text("affiliate_url").notNull(),
  imageUrl: text("image_url"),
  currentPrice: integer("current_price"),
  listPrice: integer("list_price"),
  discountRate: integer("discount_rate"),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count"),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const priceHistory = pgTable("price_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  itemId: varchar("item_id", { length: 255 })
    .references(() => items.id, { onDelete: "cascade" })
    .notNull(),
  price: integer("price").notNull(),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull(),
});
