import { useForm } from "react-hook-form";
import useTasks from "../../hooks/useTasks";

const initialState = {
  title: "",
  description: "",
  category: "Other",
  priority: 1,
  status: "To Do",
  startDate: "",
  dueDate: "",
  reminder: "",
  recurrence: "None",
};
function toLocalDateTimeString(date) {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset(); // in minutes
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function AddTask({ hideForm, task }) {
  const { createTask, updateTask } = useTasks();
  const editMode = !!task;
  console.log(task);
  const formData = task && {
    category: task.category,
    description: task.description,
    dueDate: toLocalDateTimeString(task.dueDate),
    priority: task.priority,
    recurrence: task.recurrence,
    reminder: toLocalDateTimeString(task.reminder),
    startDate: toLocalDateTimeString(task.startDate),
    status: task.status,
    title: task.title,
  };
  initialState.startDate = toLocalDateTimeString(new Date());

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: formData || initialState,
    mode: "onChange",
  });

  const startDate = watch("startDate");
  const reminder = watch("reminder");
  const dueDate = watch("dueDate");

  const onSubmit = (data) => {
    const start = data.startDate ? new Date(data.startDate) : null;
    const reminder = data.reminder ? new Date(data.reminder) : null;
    const due = data.dueDate ? new Date(data.dueDate) : null;

    const finalData = {
      ...data,
      startDate: start,
      reminder: reminder,
      dueDate: due,
    };

    if (editMode) {
      updateTask({ updates: finalData, id: task._id });
    } else {
      createTask(finalData);
    }
    hideForm();
    reset(initialState);
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 mb-3 relative">
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        {/* Header similar to TaskCard */}
        <div className="flex items-center gap-2 flex-wrap justify-between">
          <input
            type="text"
            placeholder={
              (errors.title && errors.title.message) || "Task title..."
            }
            className={`focus:outline-none border-b text-sm font-medium ${
              errors.title ? "text-red-700 border-red-700" : ""
            }`}
            {...register("title", { required: "Title is required" })}
          />
          <select
            {...register("priority")}
            className="text-xs px-2 py-1 rounded-full border"
          >
            <option value={3} className="text-red-600 font-bold">
              Urgent
            </option>
            <option value={2} className="text-yellow-500 font-bold">
              High
            </option>
            <option value={1} className="text-green-600 font-bold">
              Medium
            </option>
            <option value={0} className="text-blue-600 font-bold ">
              Low
            </option>
          </select>
        </div>
        {/* {errors.title && (
        )} */}

        {/* Description */}
        <textarea
          placeholder="Description..."
          className="border p-2 w-full text-sm rounded"
          {...register("description")}
        />

        {/* Extra details */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div>
            <label className="block text-gray-400">Category</label>
            <select
              {...register("category")}
              className="border p-1 w-full rounded"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400">Recurrence</label>
            <select
              {...register("recurrence")}
              className="border p-1 w-full rounded"
            >
              <option value="None">None</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="flex flex-col lg:flex-row gap-3 text-xs flex-wrap">
          <div>
            <label className="block text-gray-400">Start</label>
            <input
              type="datetime-local"
              // min={new Date().toISOString().slice(0, 16)}
              className={`border p-1 w-full rounded ${
                errors.startDate ? "border-red-500" : ""
              }`}
              {...register("startDate", {
                validate: (value) => {
                  if (dueDate && value && new Date(value) > new Date(dueDate)) {
                    return "Start must be before Due";
                  }
                  return true;
                },
              })}
            />
            {errors.startDate && (
              <p className="text-red-500 text-[10px]">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-400">Reminder</label>
            <input
              type="datetime-local"
              min={startDate || new Date().toISOString().slice(0, 16)}
              className={`border p-1 w-full rounded ${
                errors.reminder ? "border-red-500" : ""
              }`}
              {...register("reminder", {
                validate: (value) => {
                  if (
                    startDate &&
                    value &&
                    new Date(value) < new Date(startDate)
                  ) {
                    return "Reminder must be after Start";
                  }
                  if (dueDate && value && new Date(value) > new Date(dueDate)) {
                    return "Reminder must be before Due";
                  }
                  return true;
                },
              })}
            />
            {errors.reminder && (
              <p className="text-red-500 text-[10px]">
                {errors.reminder.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-400">Due</label>
            <input
              type="datetime-local"
              min={reminder || new Date().toISOString().slice(0, 16)}
              className={`border p-1 w-full rounded ${
                errors.dueDate ? "border-red-500" : ""
              }`}
              {...register("dueDate", {
                validate: (value) => {
                  if (
                    startDate &&
                    value &&
                    new Date(value) < new Date(startDate)
                  ) {
                    return "Due must be after Start";
                  }
                  return true;
                },
              })}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-[10px]">
                {errors.dueDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 text-sm"
          >
            {editMode ? "Save Task" : "Add Task"}
          </button>
          <button
            type="button"
            className="flex-1 border py-2 rounded-lg text-sm hover:bg-gray-100"
            onClick={hideForm}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
