// src/components/TodoList.jsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask, done: false }]);
    setNewTask("");
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Task Manager</h1>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button onClick={addTask}>Add</Button>
          </div>
          <ul className="space-y-2">
            {tasks.map((task, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-between items-center p-3 bg-white rounded-xl shadow"
              >
                <span
                  className={`cursor-pointer ${
                    task.done ? "line-through text-gray-500" : ""
                  }`}
                  onClick={() => toggleTask(index)}
                >
                  {task.text}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTask(index)}
                >
                  Delete
                </Button>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
