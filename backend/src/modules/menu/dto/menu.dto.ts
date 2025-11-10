import { OmitType, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MenuDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    parent_id: string;

    @IsNotEmpty()
    depth: number;

    @IsNotEmpty()
    sequence: number;
}

export class CreateMenuDto extends OmitType(MenuDto, ['depth', 'sequence'] as const) {}

export class UpdateMenuDto extends PartialType(MenuDto) {}

export class MoveMenuDto extends OmitType(MenuDto, ['name', 'parent_id'] as const) {
    @IsString()
    @IsOptional()
    parent_id?: string;
}

export class ReorderMenuDto extends OmitType(MenuDto, ['name', 'depth', 'parent_id'] as const) {}