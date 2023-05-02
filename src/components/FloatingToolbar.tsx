import React, {useRef, useState} from 'react';
import { PencilIcon, PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';

interface FloatingToolbarProps {
    initialTitle: string;
    onTitleChange: (newTitle: string) => void;
    onCreate: () => void;
    onEditMode: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
                                                             initialTitle,
                                                             onTitleChange,
                                                             onCreate,
                                                             onEditMode,
                                                         }) => {
    const [title, setTitle] = useState(initialTitle);
    const [editingTitle, setEditingTitle] = useState(false);
    const titleRef = useRef<HTMLSpanElement>(null);

    const handleTitleBlur = () => {
        if (!titleRef.current || !editingTitle) return;
        const newTitle = titleRef.current.textContent || '';
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
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 shadow-md p-2 rounded-lg flex items-center space-x-4 border border-gray-300">
            <div className="flex-grow">
        <span
            ref={titleRef}
            className="text-xl font-semibold inline-block"
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
                        className="h-5 w-5 text-gray-700 hover:text-black cursor-pointer transition-colors"
                        onClick={handleSaveTitle}
                    />
                    <XMarkIcon
                        className="h-5 w-5 text-gray-700 hover:text-black cursor-pointer transition-colors"
                        onClick={handleCancelTitle}
                    />
                </>
            ) : (
                <>
                    <button
                        className="text-gray-700 font-medium py-1 px-2 rounded hover:bg-gray-100 hover:text-black transition-colors"
                        onClick={handleEditTitle}
                    >
                        Edit Title
                    </button>
                    <PlusIcon
                        className="h-5 w-5 text-gray-700 hover:text-black cursor-pointer transition-colors"
                        onClick={onCreate}
                    />
                    <PencilIcon
                        className="h-5 w-5 text-gray-700 hover:text-black cursor-pointer transition-colors"
                        onClick={onEditMode}
                    />
                </>
            )}
        </div>
    );
};
