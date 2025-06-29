import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  snippet: text("snippet"),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  query: text("query").notNull(),
  filters: text("filters"), // JSON string
  resultCount: integer("result_count"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;

// Search result types
export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
  formattedUrl: string;
  htmlTitle: string;
  htmlSnippet: string;
  cacheId?: string;
  fileFormat?: string;
  image?: {
    contextLink: string;
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
  };
}

export interface SearchResponse {
  kind: string;
  url: {
    type: string;
    template: string;
  };
  queries: {
    request: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
    }>;
    nextPage?: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
    }>;
  };
  context: {
    title: string;
  };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items: SearchResult[];
}
