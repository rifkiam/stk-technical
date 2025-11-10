"use client";

import { TreeNode } from "@/app/schemas/object/tree";
import { Button } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";

interface DeleteMenuModalProps {
  itemToDelete: TreeNode;
  onClose: () => void;
  onOk: () => void;
}

export default function DeleteMenuModal({ itemToDelete, onClose, onOk }: DeleteMenuModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
        >
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div
                className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6 mx-4 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    <IoMdClose size={22} />
                </button>

                <h2 className="text-lg font-semibold mb-4">Delete Menu</h2>

                <div className="flex flex-col pb-4">
                    <p>Are you sure to delete this item?</p>
                    <p>Item: ({itemToDelete.name})</p>
                </div>

                <Button
                    className={'bg-red-600 transition duration-150 hover:bg-red-700 w-full rounded-xl py-2 '}
                    onClick={onOk}
                >
                    <p className="text-white">Delete</p>
                </Button>
            </div>
        </div>
    );
}
