import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { AddressEntity } from './address.entity';
import { PostEntity } from '../../posts/entities';
import { PublicFileEntity } from '../../files/entities';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public email: string;

    @Column()
    public name: string;

    @Column()
    @Exclude()
    public password: string;

    @OneToOne(() => AddressEntity, {
        eager: true,
        cascade: true,
    })
    @JoinColumn()
    public address: AddressEntity;

    @OneToMany(() => PostEntity, (post: PostEntity) => post.author)
    public posts: PostEntity[]

    @JoinColumn()
    @OneToOne(() => PublicFileEntity, {
        eager: true,
        nullable: true,
    })
    public avatar?: PublicFileEntity;
}