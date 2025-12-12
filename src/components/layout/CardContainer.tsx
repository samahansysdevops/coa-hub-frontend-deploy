import React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

export type AdminAction = "edit" | "delete" | null;

export interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  fullWidth?: boolean;
}
/**
 * CardContainer
 * - Displays a card with an optional image at the top
 * - Children content will be the info of staff/member
 * - Supports admin actions (edit/delete) with icon overlay
 * - fullWidth only affects layout positioning, not image size
 */
export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  className = "",
  imageSrc,
  imageAlt = "",
  isAdmin = false,
  onEdit,
  onDelete,
  fullWidth = false,
}) => (
  <div
    className={`rounded-md flex flex-col items-center p-2 md:p-3 mx-auto w-full max-w-[180px] md:max-w-[299px] min-h-[260px] md:min-h-[400px] ${className}`}
  >
    <div className="relative w-full group">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={299}
          height={382}
          className="w-full h-[230px] md:h-[382px] shadow-lg md:shadow-2xl rounded-sm object-cover mb-1.5 md:mb-2"
        />
      ) : (
        <div className="w-full h-[230px] md:h-[382px] rounded-sm bg-gray-100 border border-gray-300 mb-1.5 md:mb-2 shadow-lg md:shadow-2xl" />
      )}

      {isAdmin && (onEdit || onDelete) && (
        <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all"
              aria-label="Edit member"
            >
              <Pencil className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all"
              aria-label="Delete member"
            >
              <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
            </button>
          )}
        </div>
      )}
    </div>

    <div className="text-center space-y-0 md:space-y-0.5 text-xs md:text-sm leading-tight">
      {children}
    </div>
  </div>
);

export default CardContainer;
