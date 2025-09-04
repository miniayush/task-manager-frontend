import Button from "../../components/Button";
import useTasks from "../../hooks/useTasks";
import TaskColumn from "./TaskColumn";
import { useAuth } from "../../context/AuthContext";

export default function Tasks() {
  const { todo, inprogress, done } = useTasks();
  const { logout } = useAuth();
  return (
    <div className="p-8">
      <header className="flex justify-between items-baseline  mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Tasks</h1>
          <p className="text-gray-500 mb-6">Manage your workflow</p>
        </div>
        <Button variant="logout" onClick={logout}></Button>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn title="TO DO" tasks={todo} />
        <TaskColumn title="IN PROGRESS" tasks={inprogress} />
        <TaskColumn title="DONE" tasks={done} />
      </main>
    </div>
  );
}
