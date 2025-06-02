import { ClientProfile } from "src/user/entities/client-profile.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ClientProfile, (clientProfile) => clientProfile.cart, { onDelete: 'CASCADE' })
    @JoinColumn()
    clientProfile: ClientProfile;

    @Column('json', { nullable: true }) // ou 'text' se preferir JSON string
    items: any[]; // Melhor seria criar uma entidade CartItem separada

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalValue: number;
}
