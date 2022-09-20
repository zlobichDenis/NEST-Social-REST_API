import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities';

@Entity()
export class PrivateFileEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public key: string;

    @ManyToMany(() => UserEntity, (owner: UserEntity) => owner.files)
    public owner: UserEntity;
}