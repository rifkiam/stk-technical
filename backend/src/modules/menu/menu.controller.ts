import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, MoveMenuDto, ReorderMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { ResponseMessage } from '@/common/decorators/responseMessage.decorator';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @HttpCode(201)
  @ResponseMessage('Menu created successfully')
  async create(
    @Body() createMenuDto: CreateMenuDto
  ) {
    return await this.menuService.create(createMenuDto);
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Menus fetched successfully')
  async getTree() {
    return await this.menuService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Menu fetched successfully')
  findOne(
    @Param('id') id: string
  ) {
    return this.menuService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ResponseMessage('Menu updated successfully')
  async update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto
  ) {
    return await this.menuService.update(id, updateMenuDto);
  }

  @Patch(':id/move')
  @HttpCode(200)
  @ResponseMessage('Menu moved successfully')
  async move(
    @Param('id') id: string,
    @Body() moveMenuDto: MoveMenuDto
  ) {
    return await this.menuService.move(id, moveMenuDto);
  }

  @Patch(':id/reorder')
  @HttpCode(200)
  @ResponseMessage('Menu reordered successfully')
  async reorder(
    @Param('id') id: string,
    @Body() reorderMenuDto: ReorderMenuDto
  ) {
    return await this.menuService.reorder(id, reorderMenuDto);
  }
  
  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Menu(s) deleted successfully')
  async remove(
    @Param('id') id: string
  ) {
    return await this.menuService.remove(id);
  }
}
