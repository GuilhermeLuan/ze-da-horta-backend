import { Injectable } from '@nestjs/common';
import { CreateStockProductDto } from './dto/create-stock-product.dto';
import { UpdateStockProductDto } from './dto/update-stock-product.dto';

@Injectable()
export class StockProductService {
  create(createStockProductDto: CreateStockProductDto) {
    return 'This action adds a new stockProduct';
  }

  findAll() {
    return `This action returns all stockProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockProduct`;
  }

  update(id: number, updateStockProductDto: UpdateStockProductDto) {
    return `This action updates a #${id} stockProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockProduct`;
  }
}
