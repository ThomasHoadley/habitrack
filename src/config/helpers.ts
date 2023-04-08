import { supabase } from ".";

export async function getDates() {
  return await supabase.from("Date").select("*");
}

export async function toggleHabitComplete(habitId: number, complete: boolean) {
  return await supabase
    .from("Habits")
    .update({ complete: !complete })
    .eq("id", habitId);
}

export async function getHabits(dateId: number) {
  return await supabase
    .from("Habits")
    .select("*")
    .eq("date_foreign_key", dateId);
}
