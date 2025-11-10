export interface TreeNode {
    id: string;           // uuid
    name: string;
    parent_id?: string | null;
    depth: number;        // cached for rendering
    sequence: number;     // order among siblings
    parent: {
        name: string
    }
};