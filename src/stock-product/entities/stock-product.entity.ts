import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Stock } from '../../stock/entities/stock.entity';

@Entity()
@Index(['stock', 'product'], { unique: true })
export class StockProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @ManyToOne(() => Stock, (stock) => stock.stockProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @ManyToOne(() => Product, (product) => product.stockProducts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
