import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category, SubCategory } from '@category/entity';

import { Carteiras } from '@wallet/entity';

import { Users } from '@users/entity';

@Entity({ schema: 'public', name: 'despesas' })
export class Despesas {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text', { nullable: false })
  descricao!: string;

  @Column('integer', { default: 0 })
  valor!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  vencimento?: Date;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  pagamento?: Date;

  @Column('boolean', { default: false })
  pago?: boolean;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'user_id',
  })
  @Exclude()
  userId!: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'carteira_id',
  })
  @Exclude()
  carteiraId!: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'categoria_id',
  })
  @Exclude()
  categoriaId!: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'sub_category_id',
  })
  @Exclude()
  subCategoryId!: number;

  @Column({
    type: 'uuid',
    nullable: true,
    name: 'instalment_id',
  })
  instalmentId?: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'instalment',
    default: 1,
  })
  instalment!: number;

  @ManyToOne(() => Carteiras, (carteiras) => carteiras.id, { nullable: false })
  @JoinColumn({ name: 'carteira_id', referencedColumnName: 'id' })
  carteira?: Carteiras;

  @ManyToOne(() => Category, (categorias) => categorias.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'categoria_id', referencedColumnName: 'id' })
  categoria?: Category;

  @ManyToOne(() => SubCategory, (categorias) => categorias.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'sub_category_id', referencedColumnName: 'id' })
  subCategory?: SubCategory;

  @ManyToOne(() => Users, (users) => users.id, { nullable: false })
  @Exclude()
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: Users;

  constructor(expense: Despesas) {
    Object.assign(this, expense);
  }

  static build = (dto: Despesas): Despesas => {
    return new Despesas(dto);
  };
}
