import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProducerProfile } from '../../user/entities/producer-profile.entity';

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


  // Substitua 'any[]' pelo tipo de entidade Product e defina a relação apropriada
  // Exemplo: @OneToMany(() => Product, product => product.store)
  // Products: Product[];
  @Column({ type: 'simple-json', nullable: true }) // Temporário até definir a entidade Product
  Products: any[];

  @ManyToOne(() => ProducerProfile, (producerProfile) => producerProfile.stores)
  producerProfile: ProducerProfile; // Alterado de 'ProducerProfile: any'

  // Substitua 'any[]' pelo tipo de entidade Order e defina a relação apropriada
  // Exemplo: @OneToMany(() => Order, order => order.store)
  // Orders: Order[];
  @Column({ type: 'simple-json', nullable: true }) // Temporário até definir a entidade Order
  Orders: any[];
}
