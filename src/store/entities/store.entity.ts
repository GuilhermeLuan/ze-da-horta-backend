import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'; // Adicionar OneToMany
import { ProducerProfile } from '../../user/entities/producer-profile.entity';
import { Product } from '../../products/entities/product.entity'; // Importar Product

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  rating: number;

  // Relação OneToMany com Product
  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @ManyToOne(() => ProducerProfile, (producerProfile) => producerProfile.stores)
  producerProfile: ProducerProfile;

  @Column({ type: 'simple-json', nullable: true }) // Temporário até definir a entidade Order
  Orders: any[];
}
