export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      daily_habits: {
        Row: {
          date: string;
          habit_id: number;
          id: number;
          status: boolean;
        };
        Insert: {
          date: string;
          habit_id: number;
          id?: number;
          status?: boolean;
        };
        Update: {
          date?: string;
          habit_id?: number;
          id?: number;
          status?: boolean;
        };
      };
      habits: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      fetch_daily_habits: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: number;
          habit_id: number;
          date: string;
          status: boolean;
          habit_name: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
