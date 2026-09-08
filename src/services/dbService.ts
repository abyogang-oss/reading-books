import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
  getDocFromServer,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Book, Stamp, ClassConfig, StampType, BookColorTheme } from '../types';
import { INITIAL_BOOKS, INITIAL_CONFIG } from '../utils/storage';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: false,
      isAnonymous: true,
      tenantId: null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

const BOOKS_COLLECTION = 'books';
const STAMPS_COLLECTION = 'stamps';
const CONFIG_COLLECTION = 'config';
const CONFIG_DOC_ID = 'main';

/**
 * Validate connection to Firestore
 */
export async function testConnection(): Promise<boolean> {
  try {
    const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    await getDocFromServer(configRef);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
    return false;
  }
}

/**
 * Seed initial data if database is empty on first run,
 * prioritizing any existing local user modifications.
 */
export async function seedInitialDataIfEmpty(
  localBooks?: Book[],
  localStamps?: Stamp[],
  localConfig?: ClassConfig
): Promise<void> {
  try {
    const booksCol = collection(db, BOOKS_COLLECTION);
    const snapshot = await getDocs(booksCol);
    if (snapshot.empty) {
      console.log('Seeding initial books and config into Firestore for all devices...');
      const batch = writeBatch(db);

      const booksToSeed = localBooks && localBooks.length > 0 ? localBooks : INITIAL_BOOKS;
      for (const book of booksToSeed) {
        const bookRef = doc(db, BOOKS_COLLECTION, book.id);
        batch.set(bookRef, book);
      }

      if (localStamps && localStamps.length > 0) {
        for (const stamp of localStamps) {
          const stampRef = doc(db, STAMPS_COLLECTION, stamp.id);
          batch.set(stampRef, stamp);
        }
      }

      const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
      batch.set(configRef, localConfig || INITIAL_CONFIG);

      await batch.commit();
      console.log('Initial data seeded successfully.');
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, BOOKS_COLLECTION);
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
        handleFirestoreError(error, OperationType.LIST, BOOKS_COLLECTION);
        onError?.(error);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, BOOKS_COLLECTION);
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
        handleFirestoreError(error, OperationType.LIST, STAMPS_COLLECTION);
        onError?.(error);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, STAMPS_COLLECTION);
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
        handleFirestoreError(error, OperationType.GET, `${CONFIG_COLLECTION}/${CONFIG_DOC_ID}`);
        onError?.(error);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `${CONFIG_COLLECTION}/${CONFIG_DOC_ID}`);
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

  try {
    const bookRef = doc(db, BOOKS_COLLECTION, newId);
    await setDoc(bookRef, bookData);
    return newId;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${BOOKS_COLLECTION}/${newId}`);
    throw err;
  }
}

/**
 * Delete a book and its attached stamps
 */
export async function deleteBook(bookId: string, associatedStamps: Stamp[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    batch.delete(doc(db, BOOKS_COLLECTION, bookId));

    for (const stamp of associatedStamps) {
      if (stamp.bookId === bookId) {
        batch.delete(doc(db, STAMPS_COLLECTION, stamp.id));
      }
    }

    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${BOOKS_COLLECTION}/${bookId}`);
    throw err;
  }
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

  try {
    const stampRef = doc(db, STAMPS_COLLECTION, newId);
    await setDoc(stampRef, stampData);
    return stampData;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${STAMPS_COLLECTION}/${newId}`);
    throw err;
  }
}

/**
 * Update class configuration
 */
export async function updateConfig(newConfig: ClassConfig): Promise<void> {
  try {
    const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    await setDoc(configRef, newConfig, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${CONFIG_COLLECTION}/${CONFIG_DOC_ID}`);
    throw err;
  }
}

/**
 * Clear all stamps for a fresh session
 */
export async function clearAllStamps(stamps: Stamp[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const s of stamps) {
      batch.delete(doc(db, STAMPS_COLLECTION, s.id));
    }
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, STAMPS_COLLECTION);
    throw err;
  }
}

/**
 * Reset back to initial demo books
 */
export async function resetToDemo(currentBooks: Book[], currentStamps: Stamp[]): Promise<void> {
  try {
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
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, BOOKS_COLLECTION);
    throw err;
  }
}

