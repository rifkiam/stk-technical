import { CreateMenuFormSchema } from "@/schemas/form";
import { TreeNode } from "@/schemas/object/tree";
import { Select } from "@headlessui/react";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function CreateMenuForm({ parents }: { parents: TreeNode[] }) {
    const form = useFormContext<CreateMenuFormSchema>();
    const p: TreeNode[] = [...parents, { id: '', name: 'No parent', depth: 1, sequence: 1, parent: { name: '' } }]; // add template

    return (
        <div>
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
            <div className="flex flex-col space-y-1 mb-3">
                <label className="text-sm font-medium text-gray-700">Part of</label>
                <Select {...form.register('parent_id')}>
                    {p.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))}
                </Select>
            </div>
        </div>
    );
};
