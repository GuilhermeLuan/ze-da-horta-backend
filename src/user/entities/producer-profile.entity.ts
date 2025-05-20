import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ProducerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  cnpj: string;

  @OneToOne(() => User, (user) => user.clientProfile)
  @JoinColumn()
  user: User;
}
