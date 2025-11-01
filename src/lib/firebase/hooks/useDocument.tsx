'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export interface UseDocumentResult<T> {
  data: WithId<T> | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useDocument<T = any>(
  docRef: DocumentReference<DocumentData> | null
): UseDocumentResult<T> {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const memoizedDocRef = useMemo(() => docRef, [docRef]);

  useEffect(() => {
    if (!memoizedDocRef) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        console.error("useDocument error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]);

  return { data, loading, error };
}
