import { Exclude, Transform } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from '@category/entity';

import { Carteiras } from '@wallet/entity';

import { Users } from '@users/entity';

@Entity({ schema: 'public', name: 'despesas' })
export class Despesas {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text', { nullable: false })
  descricao!: string;

  @Column('float', { default: 0 })
  @Transform(({ value }) => Math.round(value * 100) / 100)
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

  @ManyToOne(() => Users, (users) => users.id, { nullable: false })
  @Exclude()
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: Users;

  constructor(
    userId: string,
    descricao: string,
    valor: number,
    categoriaId: number,
    carteiraId: number,
    instalment: number,
    instalmentId?: string,
    vencimento?: Date,
    pagamento?: Date,
    pago?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.userId = userId;
    this.descricao = descricao;
    this.valor = valor;
    this.categoriaId = categoriaId;
    this.carteiraId = carteiraId;
    this.instalment = instalment;
    this.instalmentId = instalmentId;
    this.vencimento = vencimento;
    this.pagamento = pagamento;
    this.pago = pago;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static build = ({
    userId,
    descricao,
    valor,
    categoriaId,
    carteiraId,
    instalment,
    instalmentId,
    vencimento,
    pagamento,
    pago,
    createdAt,
    updatedAt,
  }: Despesas): Despesas => {
    return new Despesas(
      userId,
      descricao,
      valor,
      categoriaId,
      carteiraId,
      instalment,
      instalmentId,
      vencimento,
      pagamento,
      pago,
      createdAt,
      updatedAt,
    );
  };
}
