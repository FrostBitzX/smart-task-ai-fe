"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Plus,
  Home,
  FolderKanban,
  ChevronRight,
  Calendar,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const [activeItem, setActiveItem] = useState("home");
  const [expandedWorkspace, setExpandedWorkspace] = useState<string | null>(
    "project-a"
  );

  const menuItems = [
    { id: "home", icon: Home, label: "Home", href: "#" },
    { id: "my-calendar", icon: Calendar, label: "My Calendar", href: "#" },
  ];

  const workspaces = [
    {
      id: "project-a",
      name: "Project Alpha",
      color: "bg-blue-500",
      items: [
        {
          id: "overview",
          icon: LayoutDashboard,
          label: "Overview",
          to: "/app/home",
        },
        { id: "board", icon: FolderKanban, label: "Board", to: "/app/board" },
        {
          id: "chat",
          icon: MessageCircle,
          label: "Chat AI",
          to: "/app/chat",
        },
      ],
    },
    {
      id: "project-b",
      name: "Project Beta",
      color: "bg-purple-500",
      items: [
        { id: "overview-b", icon: LayoutDashboard, label: "Overview" },
        { id: "board-b", icon: FolderKanban, label: "Board", to: "/app/board" },
        {
          id: "chat",
          icon: MessageCircle,
          label: "Chat AI",
          to: "/app/chat",
        },
      ],
    },
    {
      id: "marketing",
      name: "Marketing",
      color: "bg-green-500",
      items: [
        { id: "overview-m", icon: LayoutDashboard, label: "Overview" },
        { id: "board-m", icon: FolderKanban, label: "Board", to: "/app/board" },
        {
          id: "chat",
          icon: MessageCircle,
          label: "Chat AI",
          to: "/app/chat",
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto shrink-0">
      <div className="p-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Smart Task</h1>
        </div>

        {/* Main Menu */}
        <nav className="space-y-1 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeItem === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Workspaces */}
        <div>
          <div className="flex items-center justify-between mb-2 px-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Workspaces
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="w-4 h-4 text-gray-500" />
            </Button>
          </div>

          <div className="space-y-1">
            {workspaces.map((workspace) => (
              <div key={workspace.id}>
                {/* Workspace Header */}
                <button
                  onClick={() =>
                    setExpandedWorkspace(
                      expandedWorkspace === workspace.id ? null : workspace.id
                    )
                  }
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      expandedWorkspace === workspace.id ? "rotate-90" : ""
                    }`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full ${workspace.color}`}
                  ></div>
                  <span className="flex-1 text-left truncate">
                    {workspace.name}
                  </span>
                </button>

                {/* Workspace Items */}
                {expandedWorkspace === workspace.id && (
                  <div className="ml-6 space-y-1 mt-1">
                    {workspace.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.to ?? "#"}
                          onClick={() => setActiveItem(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeItem === item.id
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>
      </div>
    </aside>
  );
};

export default Sidebar;
