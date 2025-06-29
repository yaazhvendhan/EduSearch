import { 
  users, 
  bookmarks, 
  searchHistory,
  type User, 
  type InsertUser, 
  type Bookmark, 
  type InsertBookmark,
  type SearchHistory,
  type InsertSearchHistory
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Bookmark methods
  getBookmarks(userId: number, category?: string): Promise<Bookmark[]>;
  getBookmark(id: number): Promise<Bookmark | undefined>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: number): Promise<boolean>;
  getBookmarkCategories(userId: number): Promise<string[]>;

  // Search history methods
  getSearchHistory(userId: number, limit?: number): Promise<SearchHistory[]>;
  createSearchHistory(history: InsertSearchHistory): Promise<SearchHistory>;
  deleteSearchHistory(id: number): Promise<boolean>;
  clearSearchHistory(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bookmarks: Map<number, Bookmark>;
  private searchHistory: Map<number, SearchHistory>;
  private currentUserId: number;
  private currentBookmarkId: number;
  private currentHistoryId: number;

  constructor() {
    this.users = new Map();
    this.bookmarks = new Map();
    this.searchHistory = new Map();
    this.currentUserId = 1;
    this.currentBookmarkId = 1;
    this.currentHistoryId = 1;

    // Create a default user for demo purposes
    this.createUser({ username: "demo", password: "demo123" });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBookmarks(userId: number, category?: string): Promise<Bookmark[]> {
    const userBookmarks = Array.from(this.bookmarks.values())
      .filter(bookmark => bookmark.userId === userId);
    
    if (category) {
      return userBookmarks.filter(bookmark => bookmark.category === category);
    }
    
    return userBookmarks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBookmark(id: number): Promise<Bookmark | undefined> {
    return this.bookmarks.get(id);
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentBookmarkId++;
    const bookmark: Bookmark = { 
      id, 
      userId: insertBookmark.userId,
      title: insertBookmark.title,
      url: insertBookmark.url,
      description: insertBookmark.description ?? null,
      category: insertBookmark.category,
      snippet: insertBookmark.snippet ?? null,
      source: insertBookmark.source ?? null,
      createdAt: new Date()
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(id: number): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  async getBookmarkCategories(userId: number): Promise<string[]> {
    const userBookmarks = await this.getBookmarks(userId);
    const categories = new Set(userBookmarks.map(b => b.category));
    return Array.from(categories).sort();
  }

  async getSearchHistory(userId: number, limit = 10): Promise<SearchHistory[]> {
    return Array.from(this.searchHistory.values())
      .filter(history => history.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createSearchHistory(insertHistory: InsertSearchHistory): Promise<SearchHistory> {
    const id = this.currentHistoryId++;
    const history: SearchHistory = { 
      id,
      userId: insertHistory.userId,
      query: insertHistory.query,
      filters: insertHistory.filters || null,
      resultCount: insertHistory.resultCount || null,
      createdAt: new Date()
    };
    this.searchHistory.set(id, history);
    return history;
  }

  async deleteSearchHistory(id: number): Promise<boolean> {
    return this.searchHistory.delete(id);
  }

  async clearSearchHistory(userId: number): Promise<boolean> {
    const userHistory = Array.from(this.searchHistory.entries())
      .filter(([_, history]) => history.userId === userId);
    
    userHistory.forEach(([id]) => this.searchHistory.delete(id));
    return true;
  }
}

export const storage = new MemStorage();
