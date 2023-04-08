import { QueryClientProvider, useQuery } from "react-query";
import "./App.css";
import { queryClient, supabase } from "./config";
import { getDates, getHabits, toggleHabitComplete } from "./config/helpers";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DatesWrapper />
    </QueryClientProvider>
  );
}

function DatesWrapper() {
  const { data: datesData, error: datesError } = useQuery("dates", getDates);

  if (datesError) <p>error.message</p>;

  return (
    <>
      {datesData &&
        datesData.data &&
        datesData.data.map((data) => {
          return (
            <div key={data.id}>
              <h3>{data.Date}</h3>
              <HabitsWrapper dateId={data.id} />
            </div>
          );
        })}
    </>
  );
}

function HabitsWrapper({ dateId }: { dateId: number }) {
  const habitsQuery = useQuery("habits", () => getHabits(dateId));
  const { data: habitsData, error: habitsError } = habitsQuery;

  supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "Habits" },
      (payload) => {
        habitsQuery.refetch;
      }
    )
    .subscribe();

  return (
    <div>
      {habitsData &&
        habitsData.data &&
        habitsData.data.map((habit) => {
          return (
            <p
              key={habit.id}
              onClick={() => toggleHabitComplete(habit.id, !!habit.complete)}
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

// TODO: get the toggleHabit functionality working.
// TODO: listen to changes on toggle complete and refresh the page.
