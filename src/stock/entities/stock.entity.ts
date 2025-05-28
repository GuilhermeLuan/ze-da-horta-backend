import { Store } from '../../store/entities/store.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockProduct } from '../../stock-product/entities/stock-product.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => Store, (store) => store.stock)
  store: Store;

  @OneToMany(() => StockProduct, (stockProduct) => stockProduct.stock, {
    cascade: true,
  })
  stockProducts: StockProduct[];
}
