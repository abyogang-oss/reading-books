import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Book, Stamp, ClassConfig, StampType, BookColorTheme } from '../types';
import { INITIAL_BOOKS, INITIAL_CONFIG } from '../utils/storage';

const BOOKS_COLLECTION = 'books';
const STAMPS_COLLECTION = 'stamps';
const CONFIG_COLLECTION = 'config';
const CONFIG_DOC_ID = 'main';

/**
 * Seed initial data if database is empty on first run
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const booksCol = collection(db, BOOKS_COLLECTION);
    const snapshot = await getDocs(booksCol);
    if (snapshot.empty) {
      console.log('Seeding initial books and config into Firestore...');
      const batch = writeBatch(db);

      // Seed books
      for (const book of INITIAL_BOOKS) {
        const bookRef = doc(db, BOOKS_COLLECTION, book.id);
        batch.set(bookRef, book);
      }

      // Seed config
      const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
      batch.set(configRef, INITIAL_CONFIG);

      await batch.commit();
      console.log('Seeding complete.');
    }
  } catch (err) {
    console.warn('Could not auto-seed Firestore (using offline mode or rules active):', err);
  }
}

/**
 * Subscribe to realtime books updates across all devices
 */
export function subscribeBooks(
  onUpdate: (books: Book[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const q = query(collection(db, BOOKS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Book[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as Omit<Book, 'id'>;
          list.push({
            id: d.id,
            ...data,
          } as Book);
        });
        onUpdate(list);
      },
      (error) => {
        console.error('Books onSnapshot error:', error);
        onError?.(error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to books:', err);
    onError?.(err as Error);
    return () => {};
  }
}

/**
 * Subscribe to realtime stamps updates across all devices
 */
export function subscribeStamps(
  onUpdate: (stamps: Stamp[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const q = query(collection(db, STAMPS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Stamp[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as Omit<Stamp, 'id'>;
          list.push({
            id: d.id,
            ...data,
          } as Stamp);
        });
        onUpdate(list);
      },
      (error) => {
        console.error('Stamps onSnapshot error:', error);
        onError?.(error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to stamps:', err);
    onError?.(err as Error);
    return () => {};
  }
}

/**
 * Subscribe to realtime class config updates (title, student count)
 */
export function subscribeConfig(
  onUpdate: (config: ClassConfig) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    return onSnapshot(
      configRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as ClassConfig);
        }
      },
      (error) => {
        console.error('Config onSnapshot error:', error);
        onError?.(error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to config:', err);
    onError?.(err as Error);
    return () => {};
  }
}

/**
 * Add a new book to Firestore
 */
export async function addBook(
  title: string,
  recommenderType: 'teacher' | 'student',
  recommenderNumber?: number,
  intro?: string,
  colorTheme?: BookColorTheme
): Promise<string> {
  const newId = `book-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const bookData: Book = {
    id: newId,
    title,
    recommenderType,
    recommenderNumber: recommenderNumber || undefined,
    intro: intro || '',
    colorTheme: colorTheme || 'amber',
    createdAt: Date.now(),
  };

  const bookRef = doc(db, BOOKS_COLLECTION, newId);
  await setDoc(bookRef, bookData);
  return newId;
}

/**
 * Delete a book and its attached stamps
 */
export async function deleteBook(bookId: string, associatedStamps: Stamp[]): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, BOOKS_COLLECTION, bookId));

  for (const stamp of associatedStamps) {
    if (stamp.bookId === bookId) {
      batch.delete(doc(db, STAMPS_COLLECTION, stamp.id));
    }
  }

  await batch.commit();
}

/**
 * Add a new stamp and comment
 */
export async function addStamp(
  bookId: string,
  studentNumber: number,
  stampType: StampType,
  comment: string
): Promise<Stamp> {
  const newId = `stamp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const randomTilt = Math.floor(Math.random() * 13) - 6;

  const stampData: Stamp = {
    id: newId,
    bookId,
    studentNumber,
    stampType,
    comment,
    createdAt: Date.now(),
    rotation: randomTilt,
  };

  const stampRef = doc(db, STAMPS_COLLECTION, newId);
  await setDoc(stampRef, stampData);
  return stampData;
}

/**
 * Update class configuration
 */
export async function updateConfig(newConfig: ClassConfig): Promise<void> {
  const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
  await setDoc(configRef, newConfig, { merge: true });
}

/**
 * Clear all stamps for a fresh session
 */
export async function clearAllStamps(stamps: Stamp[]): Promise<void> {
  const batch = writeBatch(db);
  for (const s of stamps) {
    batch.delete(doc(db, STAMPS_COLLECTION, s.id));
  }
  await batch.commit();
}

/**
 * Reset back to initial demo books
 */
export async function resetToDemo(currentBooks: Book[], currentStamps: Stamp[]): Promise<void> {
  const batch = writeBatch(db);

  for (const s of currentStamps) {
    batch.delete(doc(db, STAMPS_COLLECTION, s.id));
  }
  for (const b of currentBooks) {
    batch.delete(doc(db, BOOKS_COLLECTION, b.id));
  }

  for (const book of INITIAL_BOOKS) {
    batch.set(doc(db, BOOKS_COLLECTION, book.id), book);
  }

  batch.set(doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID), INITIAL_CONFIG);

  await batch.commit();
}
