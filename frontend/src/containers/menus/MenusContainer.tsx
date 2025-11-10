"use client";

import { CreateMenuFormSchema, UpdateMenuFormSchema, updateMenuFormSchema } from "@/app/schemas/form"
import CustomInput from "@/components/menus/form/UpdateMenuForm";
import { createMenu, deleteMenu, getMenus, updateMenu } from "@/lib/api/menus";
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { Button, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IoIosArrowDown } from "react-icons/io";
import MenuTree from "@/components/menus/MenuTree";
import { TreeNode } from "@/app/schemas/object/tree";
import UpdateMenuForm from "@/components/menus/form/UpdateMenuForm";
import clsxm from "@/lib/clsxm";
import CreateMenuModal from "@/components/menus/CreateMenuModal";
import { PiPlus } from "react-icons/pi"
import { useRouter } from "next/navigation";
import DeleteMenuModal from "@/components/menus/DeleteMenuModal";
import toast from "react-hot-toast";

export default function MenusContainer() {
    const methods = useForm({
        resolver: zodResolver(updateMenuFormSchema),
    });

    const menusRef = useRef<TreeNode[]>([]);
    const [menus, setMenus] = useState<TreeNode[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<TreeNode | null>(null);
    const [toDelete, setToDelete] = useState<TreeNode | null>(null);
    const [isDeep, setIsDeep] = useState<boolean>(false);
    const [maxDepth, setMaxDepth] = useState<number>(0);
    const [pad, setPad] = useState<number>(0);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    // const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const fetchMenus = async () => {
        try {
            const data = await getMenus();
            
            if (data && Array.isArray(data)) {
                const normalized = data
                .map((d) => ({
                    ...d,
                    parent_id: d.parent_id ?? null,
                    depth: (d.depth || 1) - 1,
                }))
                .sort((a, b) => {
                    if (a.parent_id === b.parent_id) return a.sequence - b.sequence;
                    return (a.parent_id ?? "").localeCompare(b.parent_id ?? "");
                });

                setMenus(normalized);
            }
        } catch (error) {
            console.error("Failed to fetch menus:", error);
        }
    };
    
    const onSubmitUpdate: SubmitHandler<UpdateMenuFormSchema> = async (data) => {
        methods.clearErrors();

        if (!selectedMenu) return;

        try {
            const res = await updateMenu(selectedMenu.id, data);
            if (res.success) {
                await fetchMenus();
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const onSubmitDelete = async (id: string) => {
        const itemToDelete = menus.find(m => m.id === id);
        
        if (!itemToDelete) {
            toast.error(`Item with id ${id} is not found!`);
            return;
        }

        setToDelete(itemToDelete);
    }

    const onSubmitDeleteUtil = async () => {
        if (!toDelete) {
            toast.error('Item to delete is non-existent!');
            return;
        }
        
        try {
            const res = await deleteMenu(toDelete.id);
            if (res.success) {
                await fetchMenus();
                setToDelete(null);
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
    }

    const handleChooseMenu = (item: TreeNode) => {
        setSelectedMenu(item);
    }

    useEffect(() => {
        fetchMenus();
    }, []);

    useEffect(() => {
        if (menus.length > 0) {
            const maxDep = menus.sort((a, b) => b.depth - a.depth)[0].depth;
            if (maxDep >= 4) {
                setIsDeep(true);
                setMaxDepth(maxDep);
                setPad(((maxDep / 4) - 1) * 200);
            }
            menusRef.current = menus;
            console.log('max depth', maxDep);
        }
    }, [menus]);

    useEffect(() => {
        if (selectedMenu) {
            methods.setValue('name', selectedMenu.name);
            methods.setValue('parentData', selectedMenu.parent ? selectedMenu.parent.name : '');
            methods.setValue('depth', selectedMenu.depth.toString());
            methods.setValue('sequence', selectedMenu.sequence);
            methods.setValue('id', selectedMenu.id);
        }
    }, [selectedMenu])
    
    return (
        <div className="flex flex-col space-y-8 mr-4">
            <div className="flex flex-col space-y-4">
                <p>Template</p>
                <div className="max-w-80 text-left bg-gray-300 rounded-xl relative">
                    {menus.length > 0 && (
                        <Menu>
                            <MenuButton className="w-full flex justify-between px-4 py-2 items-center rounded-xl">
                                <p className="truncate">{selectedMenu ? selectedMenu.name : 'Select an item'}</p>
                                <IoIosArrowDown />
                            </MenuButton>

                            <MenuItems
                                anchor="bottom"
                                className="absolute left-0 mt-1 w-full bg-gray-200 rounded-xl overflow-clip flex flex-col space-y-2"
                            >
                                {menus.map((item, index) => (
                                    <MenuItem key={index}>
                                        <div
                                            className="hover:bg-gray-300 py-1.5 px-4 first:pt-2 last:pb-2 cursor-pointer"
                                            onClick={() => handleChooseMenu(item)}
                                        >
                                            <p>{item.name}</p>
                                        </div>
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        </Menu>
                    )}
                </div>

            </div>
            <div className="flex flex-col lg:flex-row justify-evenly lg:space-x-16 xl:space-x-32">
                <div className={clsxm("space-y-10 md:space-y-0 md:min-w-80 xl:min-w-96", pad ? `max-w-[${800 + pad}px]` : "max-w-[800px]")}>
                    <Button
                        className="flex flex-row items-center space-x-3 my-2 cursor-pointer"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <PiPlus className="h-6 w-6" />
                        <p>Add an item</p>
                    </Button>
                    {
                        menus.length > 0 &&
                        (<MenuTree deleteEvent={onSubmitDelete} onMoveSuccess={fetchMenus} onClick={setSelectedMenu} isDeep={isDeep} initial={menus} />)
                    }
                </div>

                { /* item information */ }
                <FormProvider {...methods}>
                    <div className="flex flex-col w-full">
                        <form onSubmit={methods.handleSubmit(onSubmitUpdate)}>
                            <UpdateMenuForm />
                            <Button type="submit" className="w-full lg:w-fit bg-blue-500 text-white transition duration-150 hover:bg-blue-600 px-3 py-2 rounded-lg">Submit</Button>
                        </form>
                    </div>
                </FormProvider>
            </div>
            {
                showCreateModal &&
                <CreateMenuModal
                    onCreateSuccess={() => {
                        setShowCreateModal(false);
                        fetchMenus();
                    }}
                    show={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    parentNodes={menus}
                />
            }
            {
                toDelete &&
                <DeleteMenuModal
                    itemToDelete={toDelete}
                    onOk={onSubmitDeleteUtil}
                    onClose={() => setToDelete(null)}
                />
            }
        </div>
    )
}