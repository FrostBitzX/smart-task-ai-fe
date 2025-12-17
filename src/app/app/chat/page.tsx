"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  Sparkles,
  CheckCircle2,
  Calendar,
  User,
  Loader2,
  Plus,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  tasks?: GeneratedTask[];
}

interface GeneratedTask {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: string;
  dueDate?: string;
  tags: string[];
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "สวัสดีครับ! ผมคือ AI Assistant ที่จะช่วยคุณสร้างและจัดการ tasks ได้ คุณสามารถบอกผมเกี่ยวกับโปรเจกต์หรืองานที่ต้องการทำ แล้วผมจะช่วยสร้าง tasks ให้คุณครับ",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase();

    // Check if user is asking to create tasks
    if (
      lowerInput.includes("สร้าง") ||
      lowerInput.includes("create") ||
      lowerInput.includes("ทำ") ||
      lowerInput.includes("งาน") ||
      lowerInput.includes("task") ||
      lowerInput.includes("project")
    ) {
      // Generate sample tasks based on input
      const tasks: GeneratedTask[] = [
        {
          title: "วางแผนโครงสร้างโปรเจกต์",
          description: "กำหนด architecture และเทคโนโลยีที่จะใช้",
          priority: "high",
          assignee: "Team Lead",
          dueDate: "2024-12-20",
          tags: ["planning", "architecture"],
        },
        {
          title: "ออกแบบ UI/UX",
          description: "สร้าง wireframe และ mockup",
          priority: "high",
          assignee: "Designer",
          dueDate: "2024-12-22",
          tags: ["design", "ui/ux"],
        },
        {
          title: "พัฒนา Backend API",
          description: "สร้าง RESTful API endpoints",
          priority: "medium",
          assignee: "Backend Dev",
          dueDate: "2024-12-25",
          tags: ["backend", "api"],
        },
        {
          title: "พัฒนา Frontend",
          description: "Implement UI components และ integrate กับ API",
          priority: "medium",
          assignee: "Frontend Dev",
          dueDate: "2024-12-27",
          tags: ["frontend", "react"],
        },
        {
          title: "ทดสอบระบบ",
          description: "Unit testing, Integration testing และ UAT",
          priority: "high",
          dueDate: "2024-12-30",
          tags: ["testing", "qa"],
        },
      ];

      return {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "ผมได้วิเคราะห์และสร้าง tasks ให้คุณแล้วครับ ตามที่คุณขอ นี่คือรายการงานที่แนะนำ:",
        timestamp: new Date(),
        tasks,
      };
    }

    // Default responses
    const responses = [
      "เข้าใจแล้วครับ คุณต้องการให้ผมช่วยอะไรเพิ่มเติมไหมครับ?",
      "ได้เลยครับ ผมสามารถช่วยคุณสร้าง tasks, กำหนด priority, หรือจัดการงานต่างๆ ได้ครับ",
      "มีอะไรให้ผมช่วยเพิ่มเติมไหมครับ? ลองบอกผมเกี่ยวกับโปรเจกต์ที่คุณกำลังทำอยู่สิครับ",
    ];

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
    };
  };

  const handleAddTask = (task: GeneratedTask) => {
    // TODO: Integrate with your task management system
    console.log("Adding task:", task);
    alert(`Added task: ${task.title}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="h-screen flex flex-col max-w-5xl mx-auto">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                AI Task Assistant
              </h2>
              <p className="text-sm text-gray-600">
                สร้างและจัดการ tasks ด้วย AI
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div className="shrink-0">
                {message.role === "assistant" ? (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 ${
                  message.role === "user" ? "flex justify-end" : ""
                }`}
              >
                <div
                  className={`inline-block max-w-2xl ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                      : "bg-white border border-gray-200 rounded-2xl rounded-tl-sm"
                  } p-4 shadow-sm`}
                >
                  <p
                    className={`text-sm ${
                      message.role === "user" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {message.content}
                  </p>

                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Generated Tasks */}
                {message.tasks && message.tasks.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.tasks.map((task, idx) => (
                      <Card
                        key={idx}
                        className="border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    {task.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {task.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 ml-7">
                                <Badge
                                  variant="outline"
                                  className={getPriorityColor(task.priority)}
                                >
                                  {task.priority}
                                </Badge>

                                {task.assignee && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    <User className="w-3 h-3 mr-1" />
                                    {task.assignee}
                                  </Badge>
                                )}

                                {task.dueDate && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {task.dueDate}
                                  </Badge>
                                )}

                                {task.tags.map((tag, tagIdx) => (
                                  <Badge
                                    key={tagIdx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <Button
                              size="sm"
                              onClick={() => handleAddTask(task)}
                              className="shrink-0"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">กำลังคิด...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="พิมพ์ข้อความ... (เช่น 'สร้าง tasks สำหรับโปรเจกต์ e-commerce')"
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[52px] max-h-32"
                  rows={1}
                  style={{
                    height: "auto",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                size="lg"
                className="h-[52px] px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">
              กด Enter เพื่อส่งข้อความ, Shift + Enter เพื่อขึ้นบรรทัดใหม่
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
