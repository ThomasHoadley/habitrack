import { createClient } from "@supabase/supabase-js";
import { QueryClient } from "react-query";
import { Database } from "../database.types";

export const VITE_PUBLIC_ANON_KEY = import.meta.env.VITE_PUBLIC_ANON_KEY;
export const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_PUBLIC_ANON_KEY
);

export type Dates = Database["public"]["Tables"]["Date"]["Row"][];
export type Habit = Database["public"]["Tables"]["Habits"]["Row"];
export type Habits = Database["public"]["Tables"]["Habits"]["Row"][];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});
