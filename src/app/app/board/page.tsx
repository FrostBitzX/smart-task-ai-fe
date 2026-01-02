"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  assignees: string[];
  dueDate: string;
  comments: number;
  attachments: number;
  tags: string[];
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

// Draggable Task Card Component
function DraggableTaskCard({
  task,
  columnId,
  getPriorityColor,
}: {
  task: Task;
  columnId: string;
  getPriorityColor: (priority: string) => string;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { task, columnId },
  });

  // ซ่อน card จริงเมื่อกำลังลาก (ใช้ DragOverlay แทน)
  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        className="border-gray-200 opacity-30 border-dashed"
      >
        <CardContent className="p-4 invisible">
          <div className="space-y-3">
            <h4 className="font-medium">{task.title}</h4>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing touch-manipulation"
    >
      <CardContent className="p-4 cursor-pointer select-none">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
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
                <Avatar key={idx} className="w-6 h-6 border-2 border-white">
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
                  <span className="text-xs">{task.comments}</span>
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="text-xs">{task.attachments}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Droppable Column Component
function DroppableColumn({
  column,
  children,
  isOver,
}: {
  column: Column;
  children: React.ReactNode;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <Card
      ref={setNodeRef}
      data-column-id={column.id}
      className={`h-full transition-all ${
        isOver ? "ring-2 ring-blue-400 ring-offset-2" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
            <CardTitle className="text-base">{column.title}</CardTitle>
            <Badge variant="secondary" className="ml-1">
              {column.tasks.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

// Task Card for DragOverlay (ไม่มี drag handlers)
function TaskCardOverlay({
  task,
  getPriorityColor,
}: {
  task: Task;
  getPriorityColor: (priority: string) => string;
}) {
  return (
    <Card className="shadow-2xl border-2 border-blue-400 cursor-move w-[280px]">
      <CardContent className="p-4 select-none">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
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
                <Avatar key={idx} className="w-6 h-6 border-2 border-white">
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
                  <span className="text-xs">{task.comments}</span>
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="text-xs">{task.attachments}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BoardPage() {
  const [columns, setColumns] = useState<Column[]>([
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

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [isDraggingTask, setIsDraggingTask] = useState(false);

  // Mobile swipe state
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Configure sensors for both mouse and touch
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms long press for touch
        tolerance: 8, // 8px movement tolerance during delay
      },
    })
  );

  // Scroll to column on mobile
  const scrollToColumn = useCallback(
    (index: number) => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const columnWidth = container.scrollWidth / columns.length;
        container.scrollTo({
          left: columnWidth * index,
          behavior: "smooth",
        });
        setCurrentColumnIndex(index);
      }
    },
    [columns.length]
  );

  // Handle scroll end to snap to nearest column (ปิดระหว่าง drag)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // ไม่ snap ระหว่าง drag
      if (isDraggingTask) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // เช็คอีกครั้งว่ายังไม่ได้ drag อยู่
        if (isDraggingTask) return;

        const columnWidth = container.scrollWidth / columns.length;
        const scrollPosition = container.scrollLeft;
        const nearestIndex = Math.round(scrollPosition / columnWidth);
        const clampedIndex = Math.max(
          0,
          Math.min(nearestIndex, columns.length - 1)
        );
        if (clampedIndex !== currentColumnIndex) {
          setCurrentColumnIndex(clampedIndex);
        }
        container.scrollTo({
          left: columnWidth * clampedIndex,
          behavior: "smooth",
        });
      }, 150);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [columns.length, currentColumnIndex, isDraggingTask]);

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskData = active.data.current as { task: Task; columnId: string };
    setActiveTask(taskData.task);
    setActiveColumnId(taskData.columnId);
    setIsDraggingTask(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setOverColumnId(over.id as string);
    } else {
      setOverColumnId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;

    if (!over || !activeTask || !activeColumnId) {
      setActiveTask(null);
      setActiveColumnId(null);
      setOverColumnId(null);
      return;
    }

    const targetColumnId = over.id as string;

    if (activeColumnId !== targetColumnId) {
      setColumns((prevColumns) => {
        return prevColumns.map((col) => {
          if (col.id === activeColumnId) {
            return {
              ...col,
              tasks: col.tasks.filter((t) => t.id !== activeTask.id),
            };
          }
          if (col.id === targetColumnId) {
            return {
              ...col,
              tasks: [...col.tasks, activeTask],
            };
          }
          return col;
        });
      });
    }

    setActiveTask(null);
    setActiveColumnId(null);
    setOverColumnId(null);
    setIsDraggingTask(false);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setActiveColumnId(null);
    setOverColumnId(null);
    setIsDraggingTask(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="hidden sm:block">
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

        {/* Mobile Column Navigation */}
        <div className="flex md:hidden items-center justify-between mb-4 px-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollToColumn(Math.max(0, currentColumnIndex - 1))}
            disabled={currentColumnIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            {columns.map((col, idx) => (
              <button
                key={col.id}
                onClick={() => scrollToColumn(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentColumnIndex ? col.color : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              scrollToColumn(
                Math.min(columns.length - 1, currentColumnIndex + 1)
              )
            }
            disabled={currentColumnIndex === columns.length - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Kanban Board with DndContext */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div
            ref={scrollContainerRef}
            className={`flex gap-4 overflow-x-auto pb-4 md:overflow-x-visible md:snap-none ${
              isDraggingTask ? "" : "snap-x snap-mandatory scroll-smooth"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {columns.map((column) => (
              <div
                key={column.id}
                className="shrink-0 w-[85vw] md:w-80 snap-center md:snap-align-none"
              >
                <DroppableColumn
                  column={column}
                  isOver={overColumnId === column.id}
                >
                  {column.tasks.map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      columnId={column.id}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add task
                  </Button>
                </DroppableColumn>
              </div>
            ))}
          </div>

          {/* DragOverlay - แสดง card ที่กำลังลาก */}
          <DragOverlay>
            {activeTask ? (
              <TaskCardOverlay
                task={activeTask}
                getPriorityColor={getPriorityColor}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
