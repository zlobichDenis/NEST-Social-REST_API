import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../../users/entities';

@Entity()
export class PrivateFileEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public key: string;

    @ManyToOne(() => UserEntity, (owner: UserEntity) => owner.files)
    public owner: UserEntity;
}