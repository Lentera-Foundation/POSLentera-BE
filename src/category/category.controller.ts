import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { TCreateCategoryRequest } from 'src/libs/entities/types/category/create-category.type';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from 'src/libs/dto';
import { JwtGuard } from 'src/libs/guard';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() payload: TCreateCategoryRequest) {
    return this.categoryService.create(payload);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateCategoryDto })
  update(@Param('id') id: number, @Body() payload: TCreateCategoryRequest) {
    return this.categoryService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
