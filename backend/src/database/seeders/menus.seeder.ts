import { PrismaClient } from '@prisma/client';

import menuData from './data/menus.json';

const prisma = new PrismaClient();

export default async function menusSeeder() {
  // const menuCount = await prisma.menus.count();
  await prisma.$transaction(async (tx) => {
    for (const menu of menuData) {
      await tx.menus.create({
        data: {
          id: menu.id,
          name: menu.name,
          depth: menu.depth,
          sequence: menu.sequence,
        },
      });
    }

    // Step 2: update parent links
    for (const menu of menuData) {
      if (menu.parent_id) {
        await tx.menus.update({
          where: { id: menu.id },
          data: { parent_id: menu.parent_id },
        });
      }
    }
  });

  console.log('Menus seeded successfully');
}
