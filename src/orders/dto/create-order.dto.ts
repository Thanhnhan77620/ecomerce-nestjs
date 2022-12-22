import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { OrderProducts } from '../entity/order-products.entity';
import { ORDER_TYPE } from '../orders.constant';

export class OrderTierModelDto {
  @ApiProperty({
    example: '418f79b5-9c62-45ff-933a-08c0d3e17cb9',
  })
  @IsOptional()
  @IsString()
  tierModelId: string;

  @ApiProperty({
    example: '418f79b5-9c62-45ff-933a-08c0d3e17cb9',
  })
  @IsOptional()
  @IsString()
  modelId: string;
}

export class ProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsExist, ['Product', 'id'], {
    message: 'Product not exists',
  })
  productId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  priceBeforeDiscount: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  discount: number;

  @ApiProperty({
    type: OrderTierModelDto,
    isArray: true,
  })
  @IsOptional()
  tierModels: OrderTierModelDto[];
}
export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    type: [ProductDto],
  })
  @IsNotEmpty()
  @IsArray()
  products: ProductDto[] | OrderProducts[];

  userId: string;

  @ApiProperty()
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsOptional()
  address: number;

  @ApiProperty()
  @IsNotEmpty()
  paymentMethod: string;

  status: ORDER_TYPE;

  createdBy: string;
}
