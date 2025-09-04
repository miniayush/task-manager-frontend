import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

const fetchTasks = async () => {
  const { data } = await api.get("/tasks?sort=-priority,dueDate");
  return data;
};

const createTask = async (newTask) => {
  const { data } = await api.post("/tasks", newTask);
  return data;
};

const updateTask = async ({ updates, id }) => {
  try {
    if (!id) throw new Error("Task ID is required");
    const { data } = await api.put(`/tasks/${id}`, updates);
    return data;
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

function useTasks() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const tasks = data?.data || [];
  const todo = tasks ? tasks.filter((task) => task.status === "To Do") : [];
  const inprogress = tasks
    ? tasks.filter((task) => task.status === "In Progress")
    : [];
  const done = tasks ? tasks.filter((task) => task.status === "Done") : [];

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/tasks/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  return {
    deleteTask: deleteMutation.mutate,
    updateTask: updateMutation.mutate,
    createTask: createMutation.mutate,
    todo,
    inprogress,
    done,
    isError,
    isLoading,
    isDeleting: deleteMutation.isSuccess || deleteMutation.isPending,
    isUpdating: updateMutation.isSuccess || updateMutation.isPending,
    isCreating: createMutation.isSuccess || createMutation.isPending,
  };
}

export default useTasks;
