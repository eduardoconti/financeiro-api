import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Users } from '@users/entity';

import { Despesa } from '@expense/entity';

import { Category } from './categorias.entity';

@Entity({ schema: 'public', name: 'sub_categories' })
export class SubCategory {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id?: number;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'user_id',
  })
  @Exclude()
  userId!: string;

  @Column('text', { nullable: false })
  description!: string;

  @Column({ type: 'integer', name: 'category_id', nullable: false })
  categoryId!: number;

  @ManyToOne(() => Category, category => category.subCategories, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: Category;

  @ManyToOne(() => Users, users => users.userSubCategories, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Exclude()
  user?: Users;

  @OneToMany(() => Despesa, despesas => despesas.subCategory, {
    nullable: false,
  })
  @Exclude()
  expenses?: Despesa[];

  private constructor(category: SubCategory) {
    Object.assign(this, category);
  }

  static build(category: SubCategory): SubCategory {
    return new SubCategory(category);
  }
}
