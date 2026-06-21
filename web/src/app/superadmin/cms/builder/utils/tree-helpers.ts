import { CanvasBlock } from "../components/canvas";

export function findBlock(blocks: CanvasBlock[], id: string): CanvasBlock | null {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.children) {
      const found = findBlock(block.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function insertBlock(
  blocks: CanvasBlock[],
  destinationId: string,
  index: number,
  newBlock: CanvasBlock
): CanvasBlock[] {
  const newBlocks = [...blocks];

  if (destinationId === "canvas") {
    newBlocks.splice(index, 0, newBlock);
    return newBlocks;
  }

  for (let i = 0; i < newBlocks.length; i++) {
    if (newBlocks[i].id === destinationId) {
      const children = newBlocks[i].children ? [...newBlocks[i].children!] : [];
      children.splice(index, 0, newBlock);
      newBlocks[i] = { ...newBlocks[i], children };
      return newBlocks;
    }
    if (newBlocks[i].children) {
      newBlocks[i] = {
        ...newBlocks[i],
        children: insertBlock(newBlocks[i].children!, destinationId, index, newBlock),
      };
    }
  }
  return newBlocks;
}

export function removeBlock(blocks: CanvasBlock[], id: string): CanvasBlock[] {
  return blocks
    .filter((block) => block.id !== id)
    .map((block) => {
      if (block.children) {
        return { ...block, children: removeBlock(block.children, id) };
      }
      return block;
    });
}

export function updateBlock(blocks: CanvasBlock[], id: string, newProps: any): CanvasBlock[] {
  return blocks.map((block) => {
    if (block.id === id) {
      return { ...block, props: newProps };
    }
    if (block.children) {
      return { ...block, children: updateBlock(block.children, id, newProps) };
    }
    return block;
  });
}

export function findBlockParent(blocks: CanvasBlock[], id: string, parentId: string = "canvas"): { parentId: string; index: number } | null {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].id === id) {
      return { parentId, index: i };
    }
    if (blocks[i].children) {
      const found = findBlockParent(blocks[i].children!, id, blocks[i].id);
      if (found) return found;
    }
  }
  return null;
}

export function duplicateBlockNode(block: CanvasBlock): CanvasBlock {
  return {
    ...block,
    id: crypto.randomUUID(),
    children: block.children ? block.children.map(duplicateBlockNode) : [],
  };
}
