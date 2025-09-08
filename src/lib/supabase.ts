import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anon) {
  // Helpful error for both local and Netlify builds
  // eslint-disable-next-line no-console
  console.error('Missing Supabase env vars', {
    VITE_SUPABASE_URL_present: Boolean(url),
    VITE_SUPABASE_ANON_KEY_present: Boolean(anon),
  })
  throw new Error('Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(url, anon)
