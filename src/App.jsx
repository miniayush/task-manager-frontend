import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/tasks/Tasks.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import socket from "./api/socket.js";
import Reminder from "./components/Reminder.jsx";

function App() {
  useEffect(() => {
    socket.on("taskReminder", (data) => {
      console.log("🔔 Reminder received:", data);
      const message = `Reminder: "${data.title}" ${
        data.dueDate ? `is due at ${data.dueDate}` : "is due soon!"
      }`;
      Reminder(message);
    });
    return () => {
      socket.off("taskReminder");
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected route */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/tasks" />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
