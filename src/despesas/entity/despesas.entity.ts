import { Exclude, Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Categorias } from '@categorias/entity';

import { Carteiras } from '@carteiras/entity';

import { Users } from '@users/entity';

@Entity({ schema: 'public', name: 'despesas' })
export class Despesas {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { nullable: false })
  descricao!: string;

  @Column('float', { default: 0 })
  @Transform(({ value }) => Math.round(value * 100) / 100)
  valor!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  vencimento!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  pagamento!: Date;

  @Column('boolean', { default: false })
  pago!: boolean;

  @ManyToOne(() => Carteiras, (carteiras) => carteiras.id, { nullable: false })
  carteira!: number;

  @ManyToOne(() => Categorias, (categorias) => categorias.id, {
    nullable: false,
  })
  categoria!: number;

  @ManyToOne(() => Users, (users) => users.id, { nullable: false })
  @Exclude()
  user!: string;
}
