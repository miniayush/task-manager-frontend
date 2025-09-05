import { useState } from "react";
import Bulb from "../../components/Bulb";
import Button from "../../components/Button";
import useTasks from "../../hooks/useTasks";
import AddTask from "./AddTask";

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
const TAGCOLOR = {
  Work: "text-blue-700",
  Personal: "text-green-700",
  Other: "text-gray-700",
};

function TaskCard({ task }) {
  const { deleteTask, updateTask, isDeleting, isUpdating } = useTasks();
  const priority = ["Low", "Medium", "High", "Urgent"];
  const [isEditing, setIsEditing] = useState(false);

  if (isDeleting || isUpdating) {
    return <TaskCard.Skeleton />;
  }
  if (isEditing) {
    return <AddTask task={task} hideForm={() => setIsEditing(false)} />;
  }
  if (!isEditing)
    return (
      <div className="bg-white rounded-xl  border border-stone-200 p-4 mb-3 relative group overflow-hidden">
        {/* Header */}
        <div className="flex gap-2 items-start mb-2 pr-6">
          <h3 className="text-lg font-bold text-gray-700 flex-1">
            {task.title}
          </h3>
          <Bulb
            on={task.status !== "Done"}
            variant={priority[task.priority]}
            size="sm"
          />
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-3">
          {task.category && (
            <span
              className={`text-xs px-2 py-1 rounded-full border border-gray-300 flex items-center gap-1 ${
                TAGCOLOR[task.category]
              }`}
            >
              {task.category}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h.008v.008H6V6Z"
                />
              </svg>
            </span>
          )}
          {task.recurrence !== "None" && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {task.recurrence}
            </span>
          )}
        </div>
        {task.description && (
          <div className="mb-3">
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        )}

        {/* Dates */}
        <div className="text-xs pr-6 text-gray-600 flex justify-between gap-2">
          {task.startDate && (
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
              <div className="flex flex-col gap-1">
                <span>Start</span>
                <span> {formatDate(task.startDate)}</span>
              </div>
            </div>
          )}

          {task.reminder && (
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              <div className="flex flex-col gap-1">
                <span>Reminder</span>
                <span> {formatDate(task.reminder)}</span>
              </div>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <div className="flex flex-col gap-1">
                <span>Due</span>
                <span> {formatDate(task.dueDate)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* <div className=" mt-3 pt-2 text-xs text-gray-400">
        Created {formatDate(task.createdAt)}
      </div> */}

        {/* Hover actions */}
        <div className="absolute right-0 top-0  pt-3 pb-3 pr-2 justify-evenly flex flex-col h-full translate-x-12 group-hover:translate-x-0 opacity-0  group-hover:opacity-100 transition-transform ease-in">
          <Button onClick={() => setIsEditing(true)} variant="edit" />
          <Button onClick={() => deleteTask(task._id)} variant="delete" />
          {task.status === "To Do" && (
            <Button
              onClick={() =>
                updateTask({ id: task._id, updates: { status: "In Progress" } })
              }
              variant="start"
            />
          )}
          {task.status === "In Progress" && (
            <Button
              onClick={() =>
                updateTask({ id: task._id, updates: { status: "Done" } })
              }
              variant="complete"
            />
          )}
        </div>
      </div>
    );
}

TaskCard.Skeleton = function Skeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3 animate-pulse">
      <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-2/3 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
      <div className="h-3 w-28 bg-gray-200 rounded"></div>
    </div>
  );
};

export default TaskCard;
