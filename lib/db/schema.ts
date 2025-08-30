import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  walletAddress: text('wallet_address').primaryKey(),
  username: text('username'),
  subscriptionExpiresAt: timestamp('subscription_expires_at'),
  profilePicUrl: text('profile_pic_url'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const boards = pgTable('boards', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  bannerUrl: text('banner_url'),
  pageLimit: integer('page_limit').default(10),
  threadsPerPage: integer('threads_per_page').default(15),
})

export const threads = pgTable('threads', {
  id: text('id').primaryKey(),
  boardId: text('board_id').notNull().references(() => boards.id),
  opWalletAddress: text('op_wallet_address').notNull().references(() => users.walletAddress),
  opUsername: text('op_username'),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  linkUrl: text('link_url'),
  linkTitle: text('link_title'),
  linkImageUrl: text('link_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  bumpedAt: timestamp('bumped_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const replies = pgTable('replies', {
  id: text('id').primaryKey(),
  threadId: text('thread_id').notNull().references(() => threads.id),
  walletAddress: text('wallet_address').notNull().references(() => users.walletAddress),
  username: text('username'),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  linkUrl: text('link_url'),
  linkTitle: text('link_title'),
  linkImageUrl: text('link_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
})
