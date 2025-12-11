import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export default class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'email', type: 'varchar', nullable: false, unique: true })
    email: string;

    @Column({ name: 'name', type: 'varchar', nullable: false })
    name: string;

    @Column({ name: 'address', type: 'varchar', nullable: false })
    address: string;

    @Column({ name: 'password', type: 'varchar', nullable: false })
    password: string;
}