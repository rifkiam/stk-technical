"use client";

import { TreeNode } from "@/schemas/object/tree";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@headlessui/react";
import { moveMenu, reorderMenu } from "@/lib/api/menus";
import { MoveMenuSchema, ReorderMenuSchema } from "@/schemas/form";


function Row({ item, isDeep, clickEvent, deleteEvent }: { item: TreeNode, isDeep: boolean, clickEvent: (item: TreeNode) => void, deleteEvent: (id: string) => Promise<void> }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const handleClick = () => {
    clickEvent(item);
  }

  const [delIcon, setDelIcon] = useState<boolean>(false);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        marginLeft: item.depth * INDENT,
      }}
      onClick={handleClick}
      onMouseEnter={() => setDelIcon(true)}
      onMouseLeave={() => setDelIcon(false)}
      className={`flex flex-row justify-between hover:bg-gray-200 px-2 py-1 md:px-3 md:py-2 mb-1 rounded-md border-gray-200 border bg-white cursor-grab ${isDeep ? 'w-' + (1280 - (item.depth * INDENT)) : ''}`}
    >
      <p className="truncate pr-4">{item.name}</p>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          deleteEvent(item.id);
        }}
        className={'hover:cursor-pointer'}
      >
        <FaRegTrashAlt className={`fill-red-600 ${!delIcon ? 'hidden' : ''}`} />
      </Button>
    </div>
  );
}

export default function MenuTree({
  initial,
  isDeep,
  onClick,
  onMoveSuccess,
  deleteEvent
}: {
  initial: TreeNode[],
  isDeep: boolean,
  onClick: (item: TreeNode) => void,
  onMoveSuccess: () => Promise<void>,
  deleteEvent: (id: string) => Promise<void>,
}) {
  const [nodes, setNodes] = useState<TreeNode[]>(initial);
  let flat = flatten(nodes);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [dragMeta, setDragMeta] = useState<{activeId:string; overId:string; offsetX:number} | null>(null);

  const handleMove = async (id: string, data: MoveMenuSchema) => {
    try {
      const res = await moveMenu(id, data);
      if (res.success) {
        await onMoveSuccess();
      }
    } catch (error) {
      console.error("Reorder menu failed: " + error);
    }
  }

  const handleReorder = async (id: string, data: ReorderMenuSchema) => {
    try {
      const res = await reorderMenu(id, data);
      if (res.success) {
        await onMoveSuccess();
      }
    } catch (error) {
      console.error("Reorder menu failed: " + error);
    }
  }

  function onDragMove(e: any) {
    if (!e.active || !e.over) return;
    setDragMeta({
      activeId: e.active.id,
      overId: e.over.id,
      offsetX: e.delta.x, // horizontal shift
    });
  }

  function onDragEnd(e: any) {
    const { active, over, delta } = e;
    setDragMeta(null);
    if (!over) return;

    const oldIndex = flat.findIndex(i => i.id === active.id);
    const newIndex = flat.findIndex(i => i.id === over.id);
    const verticalMoved = Math.abs(newIndex - oldIndex);
    const verticalDirection = newIndex > oldIndex ? "down" : "up";

    // horizontal movement
    const horizontalPixels = delta.x;
    const horizontalMoved = Math.round(horizontalPixels / INDENT);

    // compute depth difference
    const proj = getProjection(flat, active.id, over.id, delta.x);
    const prevDepth = flat.find(i => i.id === active.id)?.depth ?? 0;
    const newDepth = proj?.depth ?? prevDepth;
    const depthMoved = newDepth - prevDepth;

    // units calculation
    const sameParent = flat.find(i => i.id === active.id)?.parent_id === flat.find(i => i.id === over.id)?.parent_id;
    if (sameParent) {
      const sequence = newIndex; // new order index among siblings
      reorderMenu(active.id, { sequence });
    }

    if (proj) {
      const newParentId = proj.parent_id ?? null;
      const newDepth = proj.depth;
      const siblingsOfNewParent = flat.filter(i => i.parent_id === newParentId);
      const newSequence = siblingsOfNewParent.length; // append to end

      moveMenu(active.id, {
        parent_id: newParentId,
        depth: newDepth,
        sequence: newSequence
      });
    }

    console.log(`
      Drag finished:
      - Vertically passed: ${verticalMoved} rows (${verticalDirection})
      - Horizontally moved: ${horizontalMoved} indent units (${depthMoved > 0 ? "deeper" : depthMoved < 0 ? "shallower" : "same depth"})
    `);

    // then keep your existing reorder logic
    if (active.id !== over.id) {
      const movedFlat = arrayMove(flat, oldIndex, newIndex);
      const remapped = movedFlat.map((n, seq) => ({ ...n, sequence: seq }));
      setNodes(remapped);
    }

    if (!proj) return;

    setNodes(prev =>
      prev.map(n =>
        n.id === active.id ? { ...n, depth: proj.depth, parent_id: proj.parent_id } : n
      )
    );

    setNodes(prev => {
      const byParent = buildChildrenMap(prev);
      const next = prev.map(n => {
        const siblings = byParent.get(n.parent_id ?? null) ?? [];
        const index = siblings.findIndex(s => s.id === n.id);
        return { ...n, sequence: index };
      });
      return next;
    });
  }

  useEffect(() => {
    setNodes(initial);
  }, [initial]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={flat.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="w-full flex flex-col space-y-4">
          {flat.map(
            item => <Row key={item.id} item={item} isDeep={isDeep} clickEvent={onClick} deleteEvent={deleteEvent}/>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}


const INDENT = 32;

function sortSiblings(nodes: TreeNode[]) {
  nodes.sort((a,b) => a.sequence - b.sequence);
}

function buildChildrenMap(nodes: TreeNode[]) {
  const byParent = new Map<string | null, TreeNode[]>();
  nodes.forEach(n => {
    const k = n.parent_id ?? null;
    const arr = byParent.get(k) ?? [];
    arr.push(n);
    byParent.set(k, arr);
  });
  for (const arr of byParent.values()) sortSiblings(arr);
  return byParent;
}

function flatten(nodes: TreeNode[]): TreeNode[] {
  const byParent = buildChildrenMap(nodes);
  const out: TreeNode[] = [];
  function walk(parent: string | null, depth: number) {
    (byParent.get(parent) ?? []).forEach(n => {
      out.push({...n, depth});
      walk(n.id, depth + 1);
    });
  }
  walk(null, 0);
  return out;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Figure out new depth & parent based on horizontal drag and the item we're over.
 * - offsetX > 0 increases depth, < 0 decreases depth.
 * - parent becomes the closest valid ancestor according to new depth.
 */
function getProjection(flat: TreeNode[], activeId: string, overId: string, offsetX: number) {
  const activeIndex = flat.findIndex(i => i.id === activeId);
  const overIndex   = flat.findIndex(i => i.id === overId);
  if (activeIndex === -1 || overIndex === -1) return null;

  const dragged = flat[activeIndex];
  const over    = flat[overIndex];

  const deltaLevels = Math.round(offsetX / INDENT);
  const newDepth = clamp(dragged.depth + deltaLevels, 0, 10);

  // compute new parent by looking at the item just above the target index
  const targetIndex = overIndex;
  let parent_id: string | undefined = undefined;

  if (newDepth === 0) parent_id = undefined;
  else {
    // walk upward until finding an item whose depth is newDepth - 1
    for (let i = targetIndex - 1; i >= 0; i--) {
      if (flat[i].depth === newDepth - 1) {
        parent_id = flat[i].id;
        break;
      }
    }
    // if not found, force depth to 0
    if (!parent_id) return { depth: 0, parent_id: undefined };
  }

  return { depth: newDepth, parent_id };
}