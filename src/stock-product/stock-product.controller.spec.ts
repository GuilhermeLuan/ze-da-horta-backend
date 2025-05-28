import { Test, TestingModule } from '@nestjs/testing';
import { StockProductController } from './stock-product.controller';
import { StockProductService } from './stock-product.service';

describe('StockProductController', () => {
  let controller: StockProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockProductController],
      providers: [StockProductService],
    }).compile();

    controller = module.get<StockProductController>(StockProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
