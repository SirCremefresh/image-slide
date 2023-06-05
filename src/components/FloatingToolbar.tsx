import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  CloudArrowUpIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Popover, Transition } from "@headlessui/react";

import { usePopper } from "react-popper";
import { HexColorPicker } from "react-colorful";
import { EyeDropperIcon } from "@heroicons/react/24/solid";

function BackgroundColorSelector() {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
  });
  const [color, setColor] = useState("#aabbcc");

  return (
    <Popover>
      <Popover.Button as={"span"} ref={setReferenceElement}>
        <EyeDropperIcon
          style={{ fill: color }}
          className={`h-5 w-5 cursor-pointer stroke-gray-700 text-gray-700 transition-colors hover:text-black`}
        />
      </Popover.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <HexColorPicker color={color} onChange={setColor} />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

interface FloatingToolbarProps {
  initialTitle: string;
  onTitleChange: (newTitle: string) => void;
  onUpload: () => void;
}

export function FloatingToolbar({
  initialTitle,
  onTitleChange,
  onUpload,
}: FloatingToolbarProps) {
  const [title, setTitle] = useState(initialTitle);
  const [editingTitle, setEditingTitle] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (titleRef.current && editingTitle) {
      titleRef.current?.focus();
    }
  }, [titleRef, editingTitle]);

  const handleTitleBlur = () => {
    if (!titleRef.current || !editingTitle) return;
    const newTitle = sanitizeTitle(titleRef.current.textContent ?? "");
    if (newTitle === "") {
      setTitle(initialTitle);
      return;
    }

    setTitle(newTitle);
    onTitleChange(newTitle);
  };

  const sanitizeTitle = (title: string) => {
    return title.replace(/[^a-zA-Z0-9\s]/g, "");
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
    <div className="mt-2 flex items-center space-x-4 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-md">
      <div className="flex grow items-center gap-2">
        <span
          ref={titleRef}
          className="inline-block text-xl font-semibold"
          contentEditable={editingTitle}
          suppressContentEditableWarning
          onBlur={handleTitleBlur}
        >
          {title}
        </span>
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
          <PencilIcon
            className="h-5 w-5 cursor-pointer text-gray-700 transition-colors hover:text-black"
            onClick={handleEditTitle}
          />
        )}
      </div>
      <BackgroundColorSelector></BackgroundColorSelector>

      <CloudArrowUpIcon
        className="h-5 w-5 cursor-pointer text-gray-700 transition-colors hover:text-black"
        onClick={onUpload}
      />
    </div>
  );
}
