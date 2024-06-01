import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/libs/guard';
import { CreateProductDto, DeleteBatchDto } from 'src/libs/dto';
import {
  TCreateProductRequest,
  TDeleteBatchProductRequest,
} from 'src/libs/entities';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateProductDto })
  create(@Body() payload: TCreateProductRequest) {
    return this.productService.create(payload);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: number) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateProductDto })
  update(@Param('id') id: number, @Body() payload: TCreateProductRequest) {
    return this.productService.update(+id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: number) {
    return this.productService.remove(+id);
  }

  @Post('/delete-batch')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiBody({ type: DeleteBatchDto })
  deleteBatch(@Body() payload: TDeleteBatchProductRequest) {
    return this.productService.deleteBatch(payload);
  }
}
