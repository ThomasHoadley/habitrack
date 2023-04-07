import { PostgrestError, createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import "./App.css";
import { Database } from "./database.types";

const VITE_PUBLIC_ANON_KEY = import.meta.env.VITE_PUBLIC_ANON_KEY;
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_PUBLIC_ANON_KEY
);

type Date = Database["public"]["Tables"]["Date"]["Row"][];
type Habits = Database["public"]["Tables"]["Habits"]["Row"][];

function App() {
  const [dateResponse, setDateResponse] = useState<Date | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);

  async function getDates() {
    return await supabase.from("Date").select("*");
  }

  useEffect(() => {
    (async function () {
      await getDates().then((data) => {
        if (data.data) setDateResponse(data.data);
        if (data.error) setError(data.error);
      });
    })();
  }, []);

  if (error) <p>error.message</p>;
  return (
    <div>
      {dateResponse?.map((data) => {
        return (
          <div key={data.id}>
            <h1>{data.Date}</h1>
            <Habits dateId={data.id} />
          </div>
        );
      })}
    </div>
  );
}

function Habits({ dateId }: { dateId: number }) {
  const [habitResponse, setHabitResponse] = useState<Habits | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [rerender, setRerender] = useState(false);

  // TODO: listen to changes on toggle complete and refresh the page.

  async function toggleComplete(habitId: number, complete: boolean) {
    const { data, error } = await supabase
      .from("Habits")
      .update({ complete: !complete })
      .eq("id", habitId);

    if (error) throw new Error(error.message);

    if (data) {
      setRerender(!rerender);
    }
  }

  useEffect(() => {
    (async function (dateId: number) {
      await supabase
        .from("Habits")
        .select("*")
        .eq("date_foreign_key", dateId)
        .then((data) => {
          if (data.data) setHabitResponse(data.data);
          if (data.error) setError(data.error);
        });
    })(dateId);
  }, []);

  if (error) <p>error.message</p>;

  return (
    <div>
      {habitResponse?.map((habit) => {
        return (
          <p
            key={habit.id}
            onClick={() => toggleComplete(habit.id, !!habit.complete)}
            style={{ cursor: "pointer" }}
          >
            {habit.title} {habit.complete ? "✅" : "❌"}
          </p>
        );
      })}
    </div>
  );
}

export default App;
