"use client";
import React, { EventHandler, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Calendar,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Filter,
  Search,
} from "lucide-react";
import { DraggedTask } from "@/types/board";

export default function BoardPage() {
  const [columns, setColumns] = useState([
    {
      id: "todo",
      title: "To Do",
      color: "bg-gray-500",
      tasks: [
        {
          id: 1,
          title: "Update API documentation",
          description: "Review and update all endpoint documentation",
          priority: "medium",
          assignees: ["Alex K"],
          dueDate: "Dec 20",
          comments: 3,
          attachments: 2,
          tags: ["documentation", "api"],
        },
        {
          id: 2,
          title: "User testing session",
          description: "Conduct usability testing with 5 users",
          priority: "low",
          assignees: ["Emma W"],
          dueDate: "Dec 22",
          comments: 1,
          attachments: 0,
          tags: ["research", "ux"],
        },
        {
          id: 3,
          title: "Setup CI/CD pipeline",
          description: "Configure automated deployment",
          priority: "high",
          assignees: ["John D", "Mike T"],
          dueDate: "Dec 19",
          comments: 5,
          attachments: 1,
          tags: ["devops"],
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-500",
      tasks: [
        {
          id: 4,
          title: "Design new landing page",
          description: "Create modern, responsive landing page design",
          priority: "high",
          assignees: ["Sarah J"],
          dueDate: "Dec 18",
          comments: 8,
          attachments: 4,
          tags: ["design", "frontend"],
        },
        {
          id: 5,
          title: "Database optimization",
          description: "Optimize slow queries and add indexes",
          priority: "high",
          assignees: ["John D"],
          dueDate: "Dec 17",
          comments: 4,
          attachments: 0,
          tags: ["backend", "performance"],
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      color: "bg-yellow-500",
      tasks: [
        {
          id: 6,
          title: "Mobile app navigation",
          description: "Implement bottom tab navigation",
          priority: "medium",
          assignees: ["Alex K"],
          dueDate: "Dec 16",
          comments: 2,
          attachments: 3,
          tags: ["mobile", "frontend"],
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-500",
      tasks: [
        {
          id: 7,
          title: "Fix authentication bug",
          description: "Resolved token expiration issue",
          priority: "urgent",
          assignees: ["Mike T"],
          dueDate: "Dec 15",
          comments: 6,
          attachments: 1,
          tags: ["bug", "backend"],
        },
        {
          id: 8,
          title: "Update dependencies",
          description: "Upgrade to latest package versions",
          priority: "low",
          assignees: ["John D"],
          dueDate: "Dec 14",
          comments: 1,
          attachments: 0,
          tags: ["maintenance"],
        },
      ],
    },
  ]);

  const [draggedTask, setDraggedTask] = useState<DraggedTask | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDragStart = (e: any, task: any, columnId: any) => {
    setDraggedTask({ task, sourceColumnId: columnId });
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e: any) => {
    e.currentTarget.style.opacity = "1";
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (columnId: any) => {
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: any) => {
    if (e.currentTarget === e.target) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: any, targetColumnId: any) => {
    e.preventDefault();

    if (!draggedTask) return;

    const { task, sourceColumnId }: any = draggedTask;

    if (sourceColumnId === targetColumnId) {
      setDragOverColumn(null);
      return;
    }

    // Update columns state
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => {
        if (col.id === sourceColumnId) {
          // Remove task from source column
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== task.id),
          };
        }
        if (col.id === targetColumnId) {
          // Add task to target column
          return {
            ...col,
            tasks: [...col.tasks, task],
          };
        }
        return col;
      });
      return newColumns;
    });

    setDragOverColumn(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Board</h2>
              <p className="text-gray-600">
                Manage your tasks with a visual kanban board
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="shrink-0 w-80">
              <Card
                className={`h-full transition-all ${
                  dragOverColumn === column.id
                    ? "ring-2 ring-blue-400 ring-offset-2"
                    : ""
                }`}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragEnter(column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${column.color}`}
                      ></div>
                      <CardTitle className="text-base">
                        {column.title}
                      </CardTitle>
                      <Badge variant="secondary" className="ml-1">
                        {column.tasks.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {column.tasks.map((task) => (
                    <Card
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task, column.id)}
                      onDragEnd={handleDragEnd}
                      className="border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-move"
                    >
                      <CardContent className="p-4 cursor-pointer">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              {task.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {task.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs px-2 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={getPriorityColor(task.priority)}
                            >
                              {task.priority}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {task.dueDate}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex -space-x-2">
                              {task.assignees.map((assignee, idx) => (
                                <Avatar
                                  key={idx}
                                  className="w-6 h-6 border-2 border-white"
                                >
                                  <AvatarImage
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignee}`}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {assignee
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                              {task.comments > 0 && (
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span className="text-xs">
                                    {task.comments}
                                  </span>
                                </div>
                              )}
                              {task.attachments > 0 && (
                                <div className="flex items-center gap-1">
                                  <Paperclip className="w-3.5 h-3.5" />
                                  <span className="text-xs">
                                    {task.attachments}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add task
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
