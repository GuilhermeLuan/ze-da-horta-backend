import { Test, TestingModule } from '@nestjs/testing';
import { StockProductService } from './stock-product.service';

describe('StockProductService', () => {
  let service: StockProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockProductService],
    }).compile();

    service = module.get<StockProductService>(StockProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
