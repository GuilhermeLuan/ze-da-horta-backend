import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getUserReviews(userId: number): Promise<Review[]> {
    const clientProfile =
      await this.userService.findClientProfileByUserId(userId);

    const reviews = await this.reviewsRepository.findBy({
      clientProfile: { id: clientProfile.id },
    });

    if (!reviews || reviews.length === 0) {
      throw new NotFoundException(`No reviews found for user ID ${userId}`);
    }

    return reviews;
  }

  async findOneOrThrowNotFoundException(id: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['clientProfile', 'order'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
