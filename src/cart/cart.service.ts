import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) { }
  create(createCartDto: CreateCartDto) {
    return 'This action adds a new cart';
  }

  findAll(): Promise<Cart[]> {
    return this.cartRepository.find();
  }

  async findOneOrThrowNotFoundException(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['clientProfile'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }

    return cart;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  async remove(id: number) {
    await this.assertThatCartExist(id);
    return this.cartRepository.delete(id);
  }

  async assertThatCartExist(id: number): Promise<void> {
    this.findOneOrThrowNotFoundException(id);
  }
}
