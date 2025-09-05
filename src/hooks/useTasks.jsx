import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import toast from "react-hot-toast";

const fetchTasks = async () => {
  const { data } = await api.get("/tasks?sort=-priority,dueDate");
  return data;
};

const createTask = async (newTask) => {
  const { data } = await api.post("/tasks", newTask);
  return data;
};

const updateTask = async ({ updates, id }) => {
  if (!id) throw new Error("Task ID is required");
  const { data } = await api.put(`/tasks/${id}`, updates);
  return data;
};

function useTasks() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const tasks = data?.data || [];
  const todo = tasks.filter((task) => task.status === "To Do");
  const inprogress = tasks.filter((task) => task.status === "In Progress");
  const done = tasks.filter((task) => task.status === "Done");

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create task");
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
    onError: (err) => {
      toast.error(err.message || "Failed to delete task");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update task");
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
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
  };
}

export default useTasks;
