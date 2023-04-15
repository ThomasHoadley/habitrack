import React, { useState } from "react";
import { supabase } from "../config";

interface AddHabitFormProps {
  onHabitAdded: () => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onHabitAdded }) => {
  const [habitName, setHabitName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!habitName) return;

    const { error } = await supabase
      .from("habits")
      .insert([{ name: habitName }]);

    if (error) {
      console.error("Error adding new habit:", error);
    } else {
      setHabitName("");
      console.log("New habit added");
      onHabitAdded(); // Call the callback after successfully adding a habit
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="habitName">New Habit:</label>
      <input
        id="habitName"
        type="text"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
      />
      <button type="submit">Add Habit</button>
    </form>
  );
};

export default AddHabitForm;
