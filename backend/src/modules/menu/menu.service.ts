import { Injectable } from '@nestjs/common';
import { CreateMenuDto, MoveMenuDto, ReorderMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { PrismaService } from '@/providers/prisma';
import { Menus } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const parent = await this.prismaService.menus.findFirst({
      where: { id: createMenuDto.parent_id }
    });

    if (parent) { // make children of parent if parent exists
      return await this.prismaService.menus.create({
        data: {
          name: createMenuDto.name,
          parent_id: createMenuDto.parent_id,
          depth: parent.depth + 1,
          sequence: 1
        },
      });
    } else {
      return await this.prismaService.menus.create({
        data: {
          name: createMenuDto.name,
          parent_id: createMenuDto.parent_id,
          depth: 1,
          sequence: 1
        },
      });
    }
  }

  async findAll() {
    return await this.prismaService.menus.findMany({
      orderBy: [{ sequence: 'asc' }, { depth: 'asc' }],
      include: {
        parent: {
          select: { name: true }
        }
      }
    });
  }

  async getTree() {
    const menus = await this.prismaService.menus.findMany({
      include: {
        parent: {
          select: { id: true, name: true }
        }
      }
    });

    const buildTree = (items: Menus[], parentId = null) => {
      return items
        .filter((item: Menus) => item.parent_id === parentId)
        .sort((a: Menus, b: Menus) => a.sequence - b.sequence)
        .map((item: Menus) => ({
          ...item,
          children: buildTree(items, item.id),
        }));
    };

    return buildTree(menus);
  }

  async findOne(id: string) {
    return await this.prismaService.menus.findUnique({
      where: { id },
    });
  }

  async move(id: string, dto: MoveMenuDto) {
    const current = await this.prismaService.menus.findUnique({ where: { id } });
    if (!current) throw new Error("Menu not found");

    const oldParentId = current.parent_id;
    const newParentId = dto.parent_id ?? null;

    await this.prismaService.menus.update({
      where: { id },
      data: {
        parent_id: newParentId,
        depth: dto.depth,
        sequence: dto.sequence,
      },
    });

    const oldSiblings = await this.prismaService.menus.findMany({
      where: { parent_id: oldParentId },
      orderBy: { sequence: 'asc' },
    });

    const newSiblings = await this.prismaService.menus.findMany({
      where: { parent_id: newParentId },
      orderBy: { sequence: 'asc' },
    });

    const tx: any[] = [];

    oldSiblings.forEach((n, i) =>
      tx.push(this.prismaService.menus.update({ where: { id: n.id }, data: { sequence: i } }))
    );

    newSiblings.forEach((n, i) =>
      tx.push(this.prismaService.menus.update({ where: { id: n.id }, data: { sequence: i } }))
    );

    await this.prismaService.$transaction(tx);
  }

  async reorder(id: string, dto: ReorderMenuDto) {
    const current = await this.prismaService.menus.findUnique({ where: { id } });
    if (!current) throw new Error("Menu not found");

    const siblings = await this.prismaService.menus.findMany({
      where: { parent_id: current.parent_id },
      orderBy: { sequence: 'asc' },
    });

    const remaining = siblings.filter(s => s.id !== id);
    remaining.splice(dto.sequence, 0, current);

    const updates = remaining.map((node, index) =>
      this.prismaService.menus.update({
        where: { id: node.id },
        data: { sequence: index },
      })
    );

    await this.prismaService.$transaction(updates);
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const menu = await this.prismaService.menus.update({
      where: { id },
      data: {
        name: updateMenuDto.name,
        parent_id: updateMenuDto.parent_id,
        depth: updateMenuDto.depth,
        sequence: updateMenuDto.sequence,
      }
    });
    
    return menu;
  }

  async remove(id: string) {
    const collectDescendants = async (menuId: string, tx: any, acc: string[] = []): Promise<string[]> => {
      const children = await tx.menus.findMany({
        where: { parent_id: menuId },
        select: { id: true },
      });

      for (const child of children) {
        acc.push(child.id);
        await collectDescendants(child.id, tx, acc);
      }

      return acc;
    };

    await this.prismaService.$transaction(async (tx) => {
      const menu = await tx.menus.findUnique({ where: { id } });
      if (!menu) throw new Error("Menu not found");

      const allChildIds = await collectDescendants(id, tx);

      if (allChildIds.length > 0) {
        await tx.menus.deleteMany({
          where: { id: { in: allChildIds } },
        });
      }

      await tx.menus.delete({ where: { id } });
    });
  }
}
