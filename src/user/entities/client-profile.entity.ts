import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Address } from '../../address/entities/address.entity';

@Entity()
export class ClientProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  cpf: string;

  @OneToOne(() => User, (user) => user.clientProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToOne(() => Cart, (cart) => cart.clientProfile)
  cart: Cart;

  @OneToOne(() => Address, (address) => address.clientProfile, {
    onDelete: 'CASCADE',
  })
  address: Address;
}
