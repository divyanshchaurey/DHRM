import {
  type Task,
  type InsertTask,
  type Quote,
  type InsertQuote,
  type Book,
  type InsertBook,
  type UserSettings,
  type InsertUserSettings,
  type Contact,
  type InsertContact,
  tasks,
  quotes,
  books,
  userSettings,
  contacts,
} from "@shared/schema";
import { db } from "@db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<void>;

  // Quotes
  getQuotes(): Promise<Quote[]>;
  getRandomQuote(): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;

  // Books
  getBooks(): Promise<Book[]>;
  getBook(id: string): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;

  // User Settings
  getUserSettings(): Promise<UserSettings | undefined>;
  updateUserSettings(settings: Partial<InsertUserSettings>): Promise<UserSettings>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
}

export class DatabaseStorage implements IStorage {
  // Tasks
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await db
      .update(tasks)
      .set(task)
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Quotes
  async getQuotes(): Promise<Quote[]> {
    return await db.select().from(quotes);
  }

  async getRandomQuote(): Promise<Quote | undefined> {
    const allQuotes = await this.getQuotes();
    if (allQuotes.length === 0) return undefined;
    return allQuotes[Math.floor(Math.random() * allQuotes.length)];
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [newQuote] = await db.insert(quotes).values(quote).returning();
    return newQuote;
  }

  // Books
  async getBooks(): Promise<Book[]> {
    return await db.select().from(books);
  }

  async getBook(id: string): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(book: InsertBook): Promise<Book> {
    const [newBook] = await db.insert(books).values(book).returning();
    return newBook;
  }

  // User Settings
  async getUserSettings(): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).limit(1);
    if (!settings) {
      // Create default settings
      const [newSettings] = await db
        .insert(userSettings)
        .values({ streak: 0 })
        .returning();
      return newSettings;
    }
    return settings;
  }

  async updateUserSettings(
    settingsData: Partial<InsertUserSettings>
  ): Promise<UserSettings> {
    const current = await this.getUserSettings();
    if (!current) {
      const [newSettings] = await db
        .insert(userSettings)
        .values(settingsData)
        .returning();
      return newSettings;
    }

    const [updated] = await db
      .update(userSettings)
      .set(settingsData)
      .where(eq(userSettings.id, current.id))
      .returning();
    return updated;
  }

  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }
}

export const storage = new DatabaseStorage();
