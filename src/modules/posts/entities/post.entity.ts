import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinTable, Index } from 'typeorm';

import { UserEntity } from '../../users/entities';
import { CategoryEntity } from '../../categories/entities';

@Entity()
export class PostEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @Column()
    public content: string;

    @Column({ nullable: true })
    public category?: string;

    @Index('post_author_id_index')
    @ManyToOne(() => UserEntity, (author: UserEntity) => author.posts)
    public author: UserEntity;

    @ManyToMany(() => CategoryEntity)
    @JoinTable()
    public categories: CategoryEntity[];
}