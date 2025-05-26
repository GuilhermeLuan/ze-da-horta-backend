import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { ProducerProfile } from '../user/entities/producer-profile.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const producerProfile = await this.userRepository.findOne({
      where: { id: createStoreDto.producerProfileId },
    });

    if (!producerProfile) {
      throw new NotFoundException(
        `ProducerProfile with id ${createStoreDto.producerProfileId} not found`,
      );
    }

    const newStore = this.storeRepository.create({
      ...createStoreDto,
      producerProfile,
      rating: 0, // Default rating
    });

    return this.storeRepository.save(newStore);
  }

  findAll(): Promise<Store[]> {
    return this.storeRepository.find({ relations: ['producerProfile'] });
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['producerProfile'],
    });

    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const storeToUpdate = await this.storeRepository.findOne({
      where: { id },
      relations: ['producerProfile'],
    });

    if (!storeToUpdate) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    Object.assign(storeToUpdate, updateStoreDto);

    return this.storeRepository.save(storeToUpdate);
  }

  async remove(id: number): Promise<void> {
    const store = await this.findOne(id);
    await this.storeRepository.remove(store);
  }
}
