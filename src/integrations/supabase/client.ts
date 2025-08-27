
// Mock Supabase client for static demo mode
import type { Database } from './types';

// Mock client that returns empty results for all operations
const createMockClient = () => ({
  from: (table: string) => ({
    select: () => ({
      data: [],
      error: null,
      eq: () => ({ data: [], error: null }),
      neq: () => ({ data: [], error: null }),
      gt: () => ({ data: [], error: null }),
      lt: () => ({ data: [], error: null }),
      gte: () => ({ data: [], error: null }),
      lte: () => ({ data: [], error: null }),
      like: () => ({ data: [], error: null }),
      ilike: () => ({ data: [], error: null }),
      is: () => ({ data: [], error: null }),
      in: () => ({ data: [], error: null }),
      contains: () => ({ data: [], error: null }),
      containedBy: () => ({ data: [], error: null }),
      rangeGt: () => ({ data: [], error: null }),
      rangeLt: () => ({ data: [], error: null }),
      rangeGte: () => ({ data: [], error: null }),
      rangeLte: () => ({ data: [], error: null }),
      rangeAdjacent: () => ({ data: [], error: null }),
      overlaps: () => ({ data: [], error: null }),
      textSearch: () => ({ data: [], error: null }),
      match: () => ({ data: [], error: null }),
      not: () => ({ data: [], error: null }),
      or: () => ({ data: [], error: null }),
      filter: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
      limit: () => ({ data: [], error: null }),
      range: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
      maybeSingle: () => ({ data: null, error: null }),
      csv: () => ({ data: '', error: null }),
    }),
    insert: () => ({
      data: null,
      error: null,
      select: () => ({ data: [], error: null }),
    }),
    update: () => ({
      data: null,
      error: null,
      eq: () => ({ data: [], error: null }),
      select: () => ({ data: [], error: null }),
    }),
    delete: () => ({
      data: null,
      error: null,
      eq: () => ({ data: [], error: null }),
    }),
    upsert: () => ({
      data: null,
      error: null,
      select: () => ({ data: [], error: null }),
    }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
    updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
    resend: () => Promise.resolve({ data: {}, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      download: () => Promise.resolve({ data: null, error: null }),
      remove: () => Promise.resolve({ data: [], error: null }),
      list: () => Promise.resolve({ data: [], error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      createSignedUrl: () => Promise.resolve({ data: null, error: null }),
    }),
  },
  rpc: () => Promise.resolve({ data: null, error: null }),
});

export const supabase = createMockClient() as any;
