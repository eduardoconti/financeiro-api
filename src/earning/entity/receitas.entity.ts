import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Carteiras } from '@wallet/entity';

import { Users } from 'src/user/entity';

@Entity({ schema: 'public', name: 'receitas' })
export class Receitas {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text', { nullable: false })
  descricao!: string;

  @Column('float', { default: 0 })
  valor!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  pagamento?: Date;

  @Column('boolean', { default: false })
  pago?: boolean;

  @Exclude()
  @Column({
    type: 'uuid',
    nullable: false,
    name: 'user_id',
  })
  userId!: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'carteira_id',
  })
  carteiraId!: number;

  @ManyToOne(() => Carteiras, (carteiras) => carteiras.id, { nullable: false })
  @JoinColumn({ name: 'carteira_id', referencedColumnName: 'id' })
  carteira?: Carteiras;

  @ManyToOne(() => Users, (users) => users.id, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Exclude()
  user?: Users;

  constructor(
    userId: string,
    descricao: string,
    valor: number,
    carteiraId: number,
    pagamento?: Date,
    pago?: boolean,
  ) {
    this.userId = userId;
    this.descricao = descricao;
    this.valor = valor;
    this.carteiraId = carteiraId;
    this.pagamento = pagamento;
    this.pago = pago;
  }
  static build = ({
    userId,
    descricao,
    valor,
    carteiraId,
    pagamento,
    pago,
  }: Receitas): Receitas => {
    return new Receitas(userId, descricao, valor, carteiraId, pagamento, pago);
  };
}
