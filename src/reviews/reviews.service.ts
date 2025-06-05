import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly userService: UserService,
    private readonly orderService: OrdersService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: number,
  ): Promise<Review> {
    const clientProfile =
      await this.userService.findClientProfileByUserId(userId);

    await this.orderService.findOneOrThrownNotFoundException(
      createReviewDto.orderId,
    );

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      clientProfileId: clientProfile.id,
    });

    return this.reviewsRepository.save(review);
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
