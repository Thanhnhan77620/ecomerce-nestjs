import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { get, isEmpty, set } from 'lodash';
import { PAYMENT_TYPE } from 'src/payments/payment.constant';
import { ProductService } from 'src/product/product.service';
import { BaseService } from 'src/shared/services/base.service';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderProducts } from './entity/order-products.entity';
import { Orders } from './entity/orders.entity';
import { ORDER_TYPE } from './orders.constant';

@Injectable()
export class OrdersService extends BaseService<Orders, Repository<Orders>> {
  constructor(
    @InjectRepository(Orders)
    private orderRepository: Repository<Orders>,
    @InjectRepository(OrderProducts)
    private orderProductsRepository: Repository<OrderProducts>,
    private productService: ProductService,
  ) {
    super(orderRepository, 'order');
  }

  async createOrder(data: CreateOrderDto) {
    const { products } = data;
    const order = await super.create(data);
    try {
      if (!isEmpty(products)) {
        const productPromise = products.map(async (product) => {
          const params = {
            productName: get(product, 'name'),
            imagePath: get(product, 'imagePath'),
            tierModels: get(product, 'tierModels'),
          };

          set(product, 'orderId', order.id);
          set(product, 'params', params);
          return Promise.all([
            this.productService.purchaseProduct(
              +product.productId,
              product.quantity,
              product.tierModels,
            ),
            this.orderProductsRepository.save(
              this.orderProductsRepository.create(product),
            ),
          ]);
        });
        await Promise.all(productPromise);
      }
    } catch (error) {
      throw error;
    }

    return order;
  }

  async getOrdersByMe(
    paginationOptions: IPaginationOptions,
    wheres: FindOptionsWhere<unknown>,
  ) {
    let totalPages = 1;
    if (paginationOptions.limit) {
      const totalRows = await this.repository.count({
        where: wheres,
      });
      totalPages = Math.ceil(totalRows / paginationOptions.limit);
    }
    let orders = await this.repository.find({
      ...(paginationOptions.page &&
        paginationOptions.limit && {
          skip: (paginationOptions.page - 1) * paginationOptions.limit,
        }),
      ...(paginationOptions.limit && { take: paginationOptions.limit }),
      where: wheres,
      order: {
        createdAt: 'DESC',
      },
      cache: true,
    });
    const orderPromises = orders?.map(async (order) => {
      const products = await this.orderProductsRepository.find({
        where: {
          orderId: order.id,
        },
      });
      set(order, 'products', products);
      return order;
    });
    orders = await Promise.all(orderPromises);
    return infinityPagination(orders, totalPages, paginationOptions);
  }

  async handleMomoRedirect(
    extraData: string,
    callback: (orderId: number) => void,
  ): Promise<void> {
    const decodedExtraData = JSON.parse(
      Buffer.from(extraData, 'base64').toString(),
    );
    const { data } = JSON.parse(JSON.stringify(decodedExtraData));
    if (!data?.userId) {
      throw new BadRequestException('Invalid pyament infomation!');
    }

    //* prepare order data
    const createOrderDto = new CreateOrderDto();
    createOrderDto.userId = data.userId;
    createOrderDto.totalAmount = data.totalAmount;
    createOrderDto.products = data.products;
    createOrderDto.address = data.address;
    createOrderDto.status = ORDER_TYPE.DELIVERING;
    createOrderDto.paymentMethod = PAYMENT_TYPE.MOMO;
    createOrderDto.createdBy = data.createdBy;
    //* create pending order
    const order = await this.createOrder(createOrderDto);
    return callback(+order?.id);
  }

  async getOne(id: number): Promise<unknown> {
    const order = await super.findOne({ id }, ['address']);
    const products = await this.orderProductsRepository.find({
      where: {
        orderId: order.id,
      },
    });
    set(order, 'products', products);
    return order;
  }
}
