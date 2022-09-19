import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;
}