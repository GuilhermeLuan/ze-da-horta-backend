import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from '../../store/entities/store.entity';
import { InventoryItem } from '../../inventory-items/entities/inventory-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
  @Column()
  imageUrl: string;
  @Column()
  rating: number;
  @Column()
  category: string;

  @ManyToOne(() => Store, (store) => store.products)
  store: Store;

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.product)
  inventoryItems: InventoryItem[];
}
