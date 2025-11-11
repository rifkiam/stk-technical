import { TreeNode } from "@/schemas/object/tree";
import { ApiResponse, ApiService } from "./api";
import { MoveMenuSchema, ReorderMenuSchema, UpdateMenuFormSchema } from "@/schemas/form";
import toast from "react-hot-toast";

export async function getMenus() {
    const menus = await ApiService.Get<ApiResponse<TreeNode[]>>("/menu");

    if (!menus.success) {
        throw new Error(menus.message || "Failed to fetch menus");
    }

    return menus.data;
}

export async function createMenu(data: { name: string, parent_id: string }) {
    const menus = await ApiService.Post<ApiResponse<TreeNode>>(
        "/menu",
        data
    );

    if (!menus.success) {
        toast.error('Something went wrong: ' + menus.message);
        throw new Error(menus.message || "Failed to fetch menus");
    } else toast.success('Successfully submitted menu data.');

    return menus;
}

export async function updateMenu(id: string, data: UpdateMenuFormSchema) {
    const menus = await ApiService.Put<ApiResponse<TreeNode>>(
        "/menu/" + id,
        {
            ...data,
            depth: Number(data.depth)
        }
    );

    if (!menus.success) {
        toast.error('Something went wrong: ' + menus.message);
        throw new Error(menus.message || "Failed to fetch menus");
    } else toast.success('Successfully updated menu data.');

    return menus;
}

export async function deleteMenu(id: string) {
    const menus = await ApiService.Delete<ApiResponse<null>>(
        "/menu/" + id
    );

    if (!menus.success) {
        toast.error('Something went wrong: ' + menus.message);
        throw new Error(menus.message || "Failed to fetch menus");
    } else toast.success('Successfully deleted menu data.');

    return menus;
}

export async function moveMenu(id: string, data: MoveMenuSchema) {
    const move = await ApiService.Patch<ApiResponse<null>>(
        "/menu/" + id + "/move",
        data
    );

    if (!move.success) {
        toast.error('Something went wrong: ' + move.message);
        throw new Error(move.message || "Failed to fetch menus");
    } else toast.success('Item moved successfully.');

    return move;
}

export async function reorderMenu(id: string, data: ReorderMenuSchema) {
    const reorder = await ApiService.Patch<ApiResponse<null>>(
        "/menu/" + id + "/reorder",
        data
    );

    if (!reorder.success) {
        toast.error('Something went wrong: ' + reorder.message);
        throw new Error(reorder.message || "Failed to fetch menus");
    } else toast.success('Item reordered successfully.');

    return reorder;
}