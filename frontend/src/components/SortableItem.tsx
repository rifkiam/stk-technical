// import { TreeNode } from "@/app/schemas/object/tree";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// export function SortableItem({ item }: { item: TreeItem }) {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: item.global_sequence });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     marginLeft: `${item.depth * 32}px`,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="px-3 py-2 border rounded-md bg-white mb-1 cursor-move"
//     >
//       {item.name}
//     </div>
//   );
// }