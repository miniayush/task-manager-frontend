import TaskCard from "./TaskCard";
import AddTask from "./AddTask";
import { useState } from "react";
import useTasks from "../../hooks/useTasks";

export default function TaskColumn({ title, tasks }) {
  const [isAdding, setIsAdding] = useState(false);
  const { isError, isLoading } = useTasks();
  return (
    <div className="flex-1 bg-neutral-50 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-gray-700 uppercase">{title}</h2>
        <span className="text-md font-bold text-gray-700">{tasks.length}</span>
      </div>
      {isLoading && <TaskCard.Skeleton />}
      {title === "TO DO" && !isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full bg-black text-white py-2 rounded-lg mb-4 hover:bg-gray-800"
        >
          + Add task
        </button>
      )}
      {isAdding && <AddTask hideForm={() => setIsAdding(false)} />}
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
