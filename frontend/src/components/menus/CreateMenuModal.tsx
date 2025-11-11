"use client";

import { CreateMenuFormSchema, createMenuFormSchema } from "@/schemas/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import CreateMenuForm from "@/components/menus/form/CreateMenuForm";
import { Button } from "@headlessui/react";
import { TreeNode } from "@/schemas/object/tree";
import { createMenu } from "@/lib/api/menus";

interface CreateMenuModalProps {
  show: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
  parentNodes: TreeNode[];
}

export default function CreateMenuModal({ show, onClose, onCreateSuccess, parentNodes }: CreateMenuModalProps) {
    const methods = useForm<CreateMenuFormSchema>({
        resolver: zodResolver(createMenuFormSchema)
    });

    const onSubmitCreate: SubmitHandler<CreateMenuFormSchema> = async (data) => {
        methods.clearErrors();
        
        try {
            const res = await createMenu(data);
            if (res.success) onCreateSuccess()
        } catch (err) {
            console.error("Update failed:", err);
        }
    }

    if (!show) return null;

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

                <h2 className="text-lg font-semibold mb-4">Create New Menu</h2>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmitCreate)} className="flex flex-col">
                        <CreateMenuForm parents={parentNodes} />
                        <Button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
                        >
                            Submit
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
