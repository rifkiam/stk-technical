import { UpdateMenuFormSchema } from "@/schemas/form";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function UpdateMenuForm() {
    const form = useFormContext<UpdateMenuFormSchema>();

    return (
        <div>
            <div className="flex flex-col space-y-1 mb-3">
                <label className="text-sm font-medium text-gray-700">ID</label>
                <input
                    type="text"
                    {...form.register('id')}
                    readOnly={true}
                    className={`w-full rounded-lg px-4 py-2 text-sm border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-gray-500 cursor-not-allowed`}
                />
            </div>
            <div className="flex flex-col space-y-1 mb-3">
                <label className="text-sm font-medium text-gray-700">Parent Data</label>
                <input
                    type="text"
                    {...form.register('parentData')}
                    readOnly={true}
                    className={`w-full rounded-lg px-4 py-2 text-sm border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-gray-500 cursor-not-allowed `}
                />
            </div>
            <div className="flex flex-col space-y-1 mb-3">
                <label className="text-sm font-medium text-gray-700">Depth</label>
                <input
                    type="text"
                    {...form.register('depth')}
                    placeholder={'insert a depth value'}
                    readOnly={true}
                    className={`w-full rounded-lg px-4 py-2 text-sm border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-gray-500 cursor-not-allowed `}
                />
                {form.formState.errors.depth && (
                    <span className="text-xs text-red-500">Depth is required</span>
                )}
            </div>
            <div className="flex flex-col space-y-1 mb-3">
                <label className="text-sm font-medium text-gray-700">Sequence</label>
                <input
                    type="text"
                    {...form.register('sequence')}
                    placeholder={'insert value for sequence'}
                    className={`w-full rounded-lg px-4 py-2 text-sm border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-gray-500 cursor-not-allowed `}
                />
                {form.formState.errors.sequence && (
                    <span className="text-xs text-red-500">Sequence is required</span>
                )}
            </div>
            <div className="flex flex-col space-y-1 mb-3">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    {...form.register('name')}
                    placeholder={'insert a name'}
                    className={`w-full rounded-lg px-4 py-2 text-sm border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                />
                {form.formState.errors.name && (
                    <span className="text-xs text-red-500">Name is required</span>
                )}
            </div>
        </div>
    );
};
