"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
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

  // Mobile swipe state
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Touch drag state for mobile
  const [touchDragTask, setTouchDragTask] = useState<DraggedTask | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(
    null
  );
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to column on mobile
  const scrollToColumn = useCallback(
    (index: number) => {
      // ตรวจสอบว่ามี reference ของ container ที่สามารถ scroll ได้หรือไม่
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        // คำนวณความกว้างของแต่ละคอลัมน์
        // โดยเอาความกว้างรวมที่ scroll ได้ หารด้วยจำนวนคอลัมน์ทั้งหมด
        const columnWidth = container.scrollWidth / columns.length;
        // สั่งให้ container scroll ในแนวนอนไปยังตำแหน่งของคอลัมน์ที่ต้องการ
        // left = ตำแหน่งคอลัมน์ (index) × ความกว้างของคอลัมน์
        // behavior: "smooth" ทำให้เลื่อนแบบนุ่มนวล
        container.scrollTo({
          left: columnWidth * index,
          behavior: "smooth",
        });
        // อัปเดต state เพื่อบันทึกว่าปัจจุบันอยู่ที่คอลัมน์ไหน
        setCurrentColumnIndex(index);
      }
    },
    // useCallback จะสร้างฟังก์ชันใหม่เฉพาะตอนที่จำนวนคอลัมน์เปลี่ยน
    [columns.length]
  );

  // Handle scroll end to snap to nearest column
  useEffect(() => {
    // ดึง element container ที่ใช้ scroll
    const container = scrollContainerRef.current;
    if (!container) return;
    // ตัวแปร timeout ใช้หน่วงเวลา (debounce) ตรวจจับว่าเลื่อนหยุดแล้ว
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // ถ้ามีการ scroll ต่อ ให้ยกเลิก timeout เดิม
      clearTimeout(scrollTimeout);
      // ตั้ง timeout ใหม่ รอ 150ms หลังจากหยุด scroll
      scrollTimeout = setTimeout(() => {
        // คำนวณความกว้างของ 1 คอลัมน์
        const columnWidth = container.scrollWidth / columns.length;
        // ตำแหน่ง scroll ปัจจุบัน (แนวนอน)
        const scrollPosition = container.scrollLeft;
        // หาคอลัมน์ที่ใกล้ตำแหน่ง scroll มากที่สุด
        const nearestIndex = Math.round(scrollPosition / columnWidth);
        // ป้องกัน index เกินขอบ (0 ถึง columns.length - 1)
        const clampedIndex = Math.max(
          0,
          Math.min(nearestIndex, columns.length - 1)
        );
        // ถ้าคอลัมน์ที่คำนวณได้ไม่ตรงกับ state ปัจจุบัน → อัปเดต state
        if (clampedIndex !== currentColumnIndex) {
          setCurrentColumnIndex(clampedIndex);
        }

        // Snap to the nearest column
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
  }, [columns.length, currentColumnIndex]);

  // Touch handlers for mobile drag and drop
  const handleTouchStart = (
    e: React.TouchEvent,
    task: any,
    columnId: string
  ) => {
    // ดึงข้อมูลตำแหน่งนิ้วที่แตะหน้าจอครั้งแรก
    const touch = e.touches[0];
    const target = e.currentTarget as HTMLElement;

    // ตั้งเวลา long press เพื่อเริ่มโหมดลาก
    const timer = setTimeout(() => {
      setTouchDragTask({ task, sourceColumnId: columnId }); // เก็บข้อมูล task และคอลัมน์ต้นทาง
      setIsDragging(true); // ตั้งค่าว่าอยู่ในสถานะกำลังลาก
      setDragPosition({ x: touch.clientX, y: touch.clientY }); // บันทึกตำแหน่งนิ้ว เพื่อใช้คำนวณการลาก
      setDraggedElement(target); // เก็บ element ที่ถูกลากไว้ใช้งานต่อ
      target.style.opacity = "0.5";

      // ปิดการ scroll ของหน้าเว็บระหว่างลาก
      document.body.style.overflow = "hidden";
    }, 300); // 300ms long press to start drag

    setLongPressTimer(timer);
  };

  // Auto-scroll when dragging near edges
  const startAutoScroll = useCallback(
    (direction: "left" | "right") => {
      if (autoScrollIntervalRef.current) return;

      autoScrollIntervalRef.current = setInterval(() => {
        const newIndex =
          direction === "right"
            ? Math.min(columns.length - 1, currentColumnIndex + 1)
            : Math.max(0, currentColumnIndex - 1);

        if (newIndex !== currentColumnIndex) {
          scrollToColumn(newIndex);
        }
      }, 400); // Scroll every 400ms while at edge
    },
    [columns.length, currentColumnIndex, scrollToColumn]
  );

  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressTimer && !isDragging) {
      // Cancel long press if user moves before timer completes
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
      return;
    }

    if (!isDragging || !touchDragTask) return;

    const touch = e.touches[0];
    setDragPosition({ x: touch.clientX, y: touch.clientY });

    // Auto-scroll when near screen edges
    const screenWidth = window.innerWidth;
    const edgeThreshold = 50; // pixels from edge to trigger scroll

    if (touch.clientX > screenWidth - edgeThreshold) {
      // Near right edge - scroll to next column
      startAutoScroll("right");
    } else if (touch.clientX < edgeThreshold) {
      // Near left edge - scroll to previous column
      startAutoScroll("left");
    } else {
      // Not near edge - stop auto-scroll
      stopAutoScroll();
    }

    // Find which column we're over
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const columnElement = elements.find((el) =>
      el.getAttribute("data-column-id")
    );
    if (columnElement) {
      const columnId = columnElement.getAttribute("data-column-id");
      setDragOverColumn(columnId as any);
    }
  };

  const handleTouchEnd = () => {
    // Stop auto-scroll
    stopAutoScroll();

    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    if (isDragging && touchDragTask && dragOverColumn) {
      const { task, sourceColumnId } = touchDragTask;

      if (sourceColumnId !== dragOverColumn) {
        setColumns((prevColumns) => {
          return prevColumns.map((col) => {
            if (col.id === sourceColumnId) {
              return {
                ...col,
                tasks: col.tasks.filter((t) => t.id !== task.id),
              };
            }
            if (col.id === dragOverColumn) {
              return {
                ...col,
                tasks: [...col.tasks, task],
              };
            }
            return col;
          });
        });
      }
    }

    // Reset drag state
    if (draggedElement) {
      draggedElement.style.opacity = "1";
    }
    setTouchDragTask(null);
    setIsDragging(false);
    setDragOverColumn(null);
    setDraggedElement(null);
    document.body.style.overflow = "";
  };

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
      {/* Mobile drag indicator */}
      {isDragging && touchDragTask && (
        <div
          className="fixed z-50 pointer-events-none bg-white rounded-lg shadow-2xl border-2 border-blue-400 p-3 max-w-[200px]"
          style={{
            left: dragPosition.x - 100,
            top: dragPosition.y - 30,
            transform: "scale(0.9)",
          }}
        >
          <p className="text-sm font-medium truncate">
            {touchDragTask.task.title}
          </p>
          <p className="text-xs text-gray-500">Drop to move</p>
        </div>
      )}

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

        {/* Kanban Board */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 md:overflow-x-visible snap-x snap-mandatory md:snap-none scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {columns.map((column) => (
            <div
              key={column.id}
              className="shrink-0 w-[85vw] md:w-80 snap-center md:snap-align-none"
            >
              <Card
                data-column-id={column.id}
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
                      onTouchStart={(e) => handleTouchStart(e, task, column.id)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className={`border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-move touch-manipulation ${
                        isDragging && touchDragTask?.task.id === task.id
                          ? "opacity-50 scale-95"
                          : ""
                      }`}
                    >
                      <CardContent className="p-4 cursor-pointer select-none">
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
