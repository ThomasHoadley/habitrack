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
      Date: {
        Row: {
          Date: string | null;
          id: number;
        };
        Insert: {
          Date?: string | null;
          id?: number;
        };
        Update: {
          Date?: string | null;
          id?: number;
        };
      };
      Habits: {
        Row: {
          complete: boolean | null;
          date_foreign_key: number | null;
          id: number;
          title: string | null;
        };
        Insert: {
          complete?: boolean | null;
          date_foreign_key?: number | null;
          id?: number;
          title?: string | null;
        };
        Update: {
          complete?: boolean | null;
          date_foreign_key?: number | null;
          id?: number;
          title?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
