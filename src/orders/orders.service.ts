import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { Store } from '../store/entities/store.entity';
import { Address } from '../address/entities/address.entity';
import { ClientProfile } from '../user/entities/client-profile.entity';
import { OrderStatus } from './entities/order-status.enum';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { UserRole } from '../user/entities/enums/user-role';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(ClientProfile)
    private readonly clientProfileRepository: Repository<ClientProfile>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly CartService: CartService,
    private readonly userService: UserService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    this.logger.log(`Criando novo pedido para usuário ${userId}`);

    const clientProfile = await this.userService.getClientProfile(userId);

    const cart = await this.cartRepository.findOne({
      where: {
        clientProfile: { id: clientProfile.id },
      },
      relations: ['items', 'items.product', 'items.product.store'],
    });
    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    if (cart.items.length === 0) {
      throw new BadRequestException('O carrinho está vazio');
    }

    const storeId = cart.items[0].product.store.id;
    const allSameStore = cart.items.every(
      (item) => item.product.store.id === storeId,
    );
    if (!allSameStore) {
      throw new BadRequestException(
        'Todos os produtos devem ser da mesma loja',
      );
    }

    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store) {
      throw new NotFoundException('Loja não encontrada');
    }

    const deliveryAddress = await this.addressRepository.findOne({
      where: {
        clientProfile: { id: clientProfile.id },
      },
    });
    if (!deliveryAddress) {
      throw new NotFoundException(
        'Endereço de entrega não encontrado ou não pertence ao cliente',
      );
    }

    // Criar o pedido
    const order = this.orderRepository.create({
      clientProfileId: clientProfile.id,
      storeId: storeId,
      deliveryAddressId: deliveryAddress.id,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      totalValue: cart.totalValue,
      status: OrderStatus.PENDING,
      paymentMethod: createOrderDto.paymentMethod || 'PENDING',
      paymentStatus: 'PENDING',
    });

    const savedOrder = await this.orderRepository.save(order);

    // Criar os itens do pedido a partir do carrinho
    const orderItems = cart.items.map((cartItem) =>
      this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: cartItem.product.id,
        quantity: cartItem.quantity,
        unitPrice: cartItem.unitPrice,
        totalPrice: cartItem.totalPrice,
        productName: cartItem.product.name,
        productDescription: cartItem.product.description,
      }),
    );

    await this.orderItemRepository.save(orderItems);

    await this.CartService.clearCart(userId);

    // Buscar o pedido completo com todas as relações
    const completeOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: [
        'clientProfile',
        'store',
        'deliveryAddress',
        'items',
        'items.product',
      ],
    });

    if (!completeOrder) {
      throw new NotFoundException('Erro ao buscar pedido criado');
    }

    this.logger.log(`Pedido ${savedOrder.id} criado com sucesso`);

    return completeOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: [
        'clientProfile',
        'store',
        'deliveryAddress',
        'items',
        'items.product',
      ],
      order: { orderDateTime: 'DESC' },
    });
  }

  async findOne(
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'clientProfile',
        'store',
        'deliveryAddress',
        'items',
        'items.product',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    // Verificar permissão
    if (userRole === UserRole.CLIENT) {
      const clientProfile = await this.clientProfileRepository.findOne({
        where: { user: { id: userId } },
      });
      if (!clientProfile || order.clientProfileId !== clientProfile.id) {
        throw new ForbiddenException(
          'Você não tem permissão para acessar este pedido',
        );
      }
    } else if (userRole === UserRole.PRODUCER) {
      const store = await this.storeRepository.findOne({
        where: { producerProfile: { user: { id: userId } } },
      });
      if (!store || order.storeId !== store.id) {
        throw new ForbiddenException(
          'Você não tem permissão para acessar este pedido',
        );
      }
    }

    return order;
  }

  async findByClient(userId: number): Promise<Order[]> {
    const clientProfile = await this.clientProfileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!clientProfile) {
      throw new NotFoundException('Perfil do cliente não encontrado');
    }

    return this.orderRepository.find({
      where: { clientProfileId: clientProfile.id },
      relations: ['store', 'deliveryAddress', 'items', 'items.product'],
      order: { orderDateTime: 'DESC' },
    });
  }

  async findByStore(userId: number): Promise<Order[]> {
    const store = await this.storeRepository.findOne({
      where: { producerProfile: { user: { id: userId } } },
    });
    if (!store) {
      throw new NotFoundException('Loja não encontrada');
    }

    return this.orderRepository.find({
      where: { storeId: store.id },
      relations: ['clientProfile', 'deliveryAddress', 'items', 'items.product'],
      order: { orderDateTime: 'DESC' },
    });
  }

  async updateStatus(
    id: number,
    status: OrderStatus,
    userId: number,
  ): Promise<Order> {
    const order = await this.findOne(id, userId, UserRole.PRODUCER);

    // Validar transições de status
    const validTransitions = this.getValidStatusTransitions(order.status);
    if (!validTransitions.includes(status)) {
      throw new BadRequestException(
        `Não é possível alterar o status de ${order.status} para ${status}`,
      );
    }

    order.status = status;

    // Se o pedido foi entregue, definir a data de entrega
    if (status === OrderStatus.DELIVERED) {
      order.deliveryDateTime = new Date();
    }

    const updatedOrder = await this.orderRepository.save(order);
    this.logger.log(`Status do pedido ${id} alterado para ${status}`);

    return updatedOrder;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
    userId: number,
  ): Promise<Order> {
    const order = await this.findOne(id, userId, UserRole.CLIENT);

    // Apenas alguns campos podem ser atualizados
    if (updateOrderDto.deliveryAddressId) {
      const deliveryAddress = await this.addressRepository.findOne({
        where: {
          id: updateOrderDto.deliveryAddressId,
          clientProfile: { id: order.clientProfileId },
        },
      });
      if (!deliveryAddress) {
        throw new NotFoundException('Endereço de entrega não encontrado');
      }
      order.deliveryAddressId = updateOrderDto.deliveryAddressId;
    }

    return this.orderRepository.save(order);
  }

  async remove(id: number, userId: number): Promise<void> {
    const order = await this.findOne(id, userId, UserRole.CLIENT);

    // Apenas pedidos pendentes podem ser cancelados/removidos
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        'Apenas pedidos pendentes podem ser cancelados',
      );
    }

    await this.orderRepository.remove(order);
    this.logger.log(`Pedido ${id} removido`);
  }

  async cancelOrder(id: number, userId: number): Promise<Order> {
    const order = await this.findOne(id, userId, UserRole.CLIENT);

    // Verificar se o pedido pode ser cancelado
    if ([OrderStatus.DELIVERED, OrderStatus.CANCELED].includes(order.status)) {
      throw new BadRequestException('Este pedido não pode ser cancelado');
    }

    order.status = OrderStatus.CANCELED;

    const canceledOrder = await this.orderRepository.save(order);
    this.logger.log(`Pedido ${id} cancelado`);

    // TODO: Processar estorno do pagamento se necessário
    // TODO: Notificar loja sobre cancelamento

    return canceledOrder;
  }

  private getValidStatusTransitions(currentStatus: OrderStatus): OrderStatus[] {
    const transitions = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELED],
      [OrderStatus.CONFIRMED]: [
        OrderStatus.IN_PREPARATION,
        OrderStatus.CANCELED,
      ],
      [OrderStatus.IN_PREPARATION]: [OrderStatus.READY_FOR_PICKUP],
      [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.IN_TRANSIT],
      [OrderStatus.IN_TRANSIT]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELED]: [],
    };

    return transitions[currentStatus] || [];
  }
}
