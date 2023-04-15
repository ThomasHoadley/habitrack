import "./App.css";

import { useEffect, useState } from "react";
import { supabase } from "./config";
import { Database } from "./database.types";

export type HabitData =
  Database["public"]["Functions"]["fetch_daily_habits"]["Returns"][0];

export type Habit = Database["public"]["Tables"]["habits"]["Row"];

function App() {
  const [habitsData, setHabitsData] = useState<HabitData[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const uniqueDates = Array.from(new Set(habitsData.map((h) => h.date))).sort();
  const [uniqueHabits, setUniqueHabits] = useState<
    { id: number; name: string }[]
  >([]);

  const addDailyHabit = async (date: string, habitId: number) => {
    const { error } = await supabase
      .from("daily_habits")
      .insert({ date, habit_id: habitId, status: false });

    if (error) {
      console.error("Error adding daily habit:", error);
    } else {
      console.log("Daily habit added successfully!");
    }
  };

  const addNewHabit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 1. Insert new habit into the 'habits' table
    const { data: newHabit, error: insertHabitError } = await supabase
      .from("habits")
      .insert({ name: newHabitName })
      .select();

    if (insertHabitError) {
      console.error("Error inserting new habit:", insertHabitError);
      return;
    }

    if (!newHabit) return;

    // 2. Add a new row to the 'daily_habits' table for the new habit and the current date
    const { error: insertDailyHabitError } = await supabase
      .from("daily_habits")
      .insert({
        habit_id: newHabit[0].id,
        date: new Date().toISOString().split("T")[0],
        status: false,
      });

    if (insertDailyHabitError) {
      console.error("Error inserting daily habit:", insertDailyHabitError);
      return;
    }

    // 3. Update the state with the new habit and daily habit data
    setHabitsData([
      ...habitsData,
      {
        id: habitsData.length + 1,
        habit_id: newHabit[0].id,
        habit_name: newHabit[0].name,
        date: new Date().toISOString().split("T")[0],
        status: false,
      },
    ]);
    setUniqueHabits([
      ...uniqueHabits,
      { id: newHabit[0].id, name: newHabit[0].name },
    ]);
  };

  const fetchHabits = async () => {
    const { data, error } = await supabase.rpc("fetch_daily_habits");

    if (error) {
      console.error("Error fetching habits:", error);
    } else {
      setHabitsData(data as HabitData[]);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    if (habitsData.length) {
      const updatedUniqueHabits = habitsData
        .reduce((acc: { id: number; name: string }[], h) => {
          if (!acc.find((habit) => habit.id === h.habit_id)) {
            acc.push({ id: h.habit_id, name: h.habit_name });
          }
          return acc;
        }, [])
        .sort((a, b) => a.name.localeCompare(b.name));

      setUniqueHabits(updatedUniqueHabits);
    }
  }, [habitsData]);

  const toggleStatus = async (habit: HabitData) => {
    const newStatus = !habit.status;
    const { error } = await supabase
      .from("daily_habits")
      .update({ status: newStatus })
      .eq("id", habit.id);

    if (error) {
      console.error("Error toggling status:", error);
    } else {
      setHabitsData((prevState) =>
        prevState.map((h) =>
          h.id === habit.id ? { ...h, status: newStatus } : h
        )
      );
    }
  };

  // Update the table cell with an onClick handler
  return (
    <div>
      <form onSubmit={addNewHabit}>
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <button type="submit">Add Habit</button>
      </form>

      <table className="table-auto">
        <thead>
          <tr>
            <th>Date</th>
            {uniqueHabits.map((habit) => (
              <th key={habit.id}>{habit.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uniqueDates.map((date) => (
            <tr key={date}>
              <td>{date}</td>
              {uniqueHabits.map((habit) => {
                const habitData = habitsData.find(
                  (h) => h.date === date && h.habit_id === habit.id
                );
                const dailyHabitId =
                  habitData && habitData.id ? habitData.id : "";
                // if (!habitData) return;
                return (
                  <td
                    data-date={date}
                    data-daily_habit_id={dailyHabitId}
                    data-habit_id={habit?.id}
                    key={habit.id}
                    onClick={(event: any) => {
                      const { date, daily_habit_id, habit_id } =
                        event.target.dataset;

                      return habitData
                        ? toggleStatus(habitData)
                        : addDailyHabit(date, habit_id);
                    }}
                    style={{ cursor: habitData ? "pointer" : "default" }}
                  >
                    {habitData?.status ? <>✅</> : <>❌</>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
