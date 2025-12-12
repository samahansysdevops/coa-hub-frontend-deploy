"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

interface Announcement {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
  title: string;
  body: string;
  image?: string;
}

interface AnnouncementCardProps {
  announcement: Announcement;
  variant?: "admin" | "public";
  isExpanded?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleExpand?: () => void;
}

export default function AnnouncementCard({
  announcement,
  variant = "public",
  isExpanded = false,
  onEdit,
  onDelete,
  onToggleExpand,
}: AnnouncementCardProps) {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };
  const isExpandedState =
    onToggleExpand !== undefined ? isExpanded : localExpanded;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-[#5a5f6b] rounded-lg overflow-hidden">
      {/* card header */}
      <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
        {/* author info */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 bg-gray-600">
            <AvatarImage
              src={announcement.author.avatar || "/assets/images/logo-dark.png"}
              alt={announcement.author.name}
            />
            <AvatarFallback className="bg-gray-600 text-white text-base sm:text-lg font-medium">
              <img
                src="/assets/images/logo-dark.png"
                alt="COA Logo"
                className="w-full h-full object-contain p-1"
              />
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-base sm:text-lg">
              {announcement.author.name}
            </h4>
            <p className="text-gray-400 text-xs sm:text-sm">
              {announcement.author.role}
            </p>
            <p className="text-gray-300 text-sm sm:text-base">
              {formatDate(announcement.createdAt)}
            </p>
          </div>
        </div>

        {/* Action Buttons (for Admin) */}
        {variant === "admin" && (
          <>
            {/* Desktop - Sleek circular design */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                onClick={() => onEdit?.(announcement.id)}
              >
                <MdOutlineModeEdit className="w-5 h-5 text-white" />
              </button>
              <button
                type="button"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                onClick={() => onDelete?.(announcement.id)}
              >
                <RiDeleteBin6Line className="w-5 h-5 text-red-100" />
              </button>
            </div>

            {/* Mobile - 3 dots menu */}
            <div className="sm:hidden relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:text-white hover:bg-transparent p-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>

              {/* Dropdown menu */}
              {mobileMenuOpen && (
                <div className="absolute right-0 top-12 bg-[#4a4f5a] rounded-lg shadow-lg py-2 z-10 min-w-[140px] border border-white/10">
                  <button
                    onClick={() => {
                      onEdit?.(announcement.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-white hover:bg-white/10 flex items-center gap-3 text-sm"
                  >
                    <MdOutlineModeEdit className="h-5 w-5" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(announcement.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-white hover:bg-white/10 flex items-center gap-3 text-sm"
                  >
                    <RiDeleteBin6Line className="h-5 w-5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* card body */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4">
        {/* title */}
        <h3 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide">
          {announcement.title}
        </h3>
        {/* the body - collapsed/expanded */}
        <div className="text-gray-300 text-base sm:text-lg leading-relaxed">
          {isExpandedState ? (
            <p className="whitespace-pre-wrap">{announcement.body}</p>
          ) : (
            <p className="line-clamp-3">{announcement.body}</p>
          )}
        </div>

        {/* Image - Only show when expanded */}
        {isExpandedState && announcement.image && (
          <div className="mt-5">
            <img
              src={announcement.image}
              alt={announcement.title}
              className="w-full rounded-lg object-cover"
            />
          </div>
        )}

        {/* expand/collapse button */}
        {announcement.body.length > 150 && (
          <button
            onClick={handleToggleExpand}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-300 text-sm sm:text-base mt-3 transition-colors"
          >
            {isExpandedState ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show more
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
