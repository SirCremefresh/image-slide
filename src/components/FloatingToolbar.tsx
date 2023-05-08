import { useRef, useState } from "react";
import {
  CheckIcon,
  CloudArrowUpIcon,
  PencilIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

interface FloatingToolbarProps {
  initialTitle: string;
  onTitleChange: (newTitle: string) => void;
  onCreate: () => void;
  onEditMode: () => void;
  onUpload: () => void;
}

export function FloatingToolbar({
  initialTitle,
  onTitleChange,
  onCreate,
  onEditMode,
  onUpload,
}: FloatingToolbarProps) {
  const [title, setTitle] = useState(initialTitle);
  const [editingTitle, setEditingTitle] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);

  const handleTitleBlur = () => {
    if (!titleRef.current || !editingTitle) return;
    const newTitle = titleRef.current.textContent || "";
    setTitle(newTitle);
    onTitleChange(newTitle);
  };

  const handleEditTitle = () => {
    setEditingTitle(true);
  };

  const handleSaveTitle = () => {
    setEditingTitle(false);
    handleTitleBlur();
  };

  const handleCancelTitle = () => {
    setEditingTitle(false);
    setTitle(initialTitle);
  };

  return (
    <div className="fixed left-1/2 top-4 flex -translate-x-1/2 transform items-center space-x-4 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-md">
      <div className="flex-grow">
        <span
          ref={titleRef}
          className="inline-block text-xl font-semibold"
          contentEditable={editingTitle}
          suppressContentEditableWarning
          onBlur={handleTitleBlur}
        >
          {title}
        </span>
      </div>
      {editingTitle ? (
        <>
          <CheckIcon
            className="h-5 w-5 cursor-pointer text-gray-700 transition-colors hover:text-black"
            onClick={handleSaveTitle}
          />
          <XMarkIcon
            className="h-5 w-5 cursor-pointer text-gray-700 transition-colors hover:text-black"
            onClick={handleCancelTitle}
          />
        </>
      ) : (
        <>
          <button
            className="rounded px-2 py-1 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
            onClick={handleEditTitle}
          >
            Edit Title
          </button>
          <PlusIcon
            className="h-5 w-5 cursor-pointer text-gray-700 transition-colors hover:text-black"
            onClick={onCreate}
          />
          <PencilIcon
            className="h-5 w-5 cursor-pointer text-gray-700 transition-colors hover:text-black"
            onClick={onEditMode}
          />
          <CloudArrowUpIcon
            className="h-5 w-5 cursor-pointer text-gray-700 transition-colors hover:text-black"
            onClick={onUpload}
          />
        </>
      )}
    </div>
  );
}
