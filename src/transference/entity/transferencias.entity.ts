import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Carteiras } from '@wallet/entity';

import { Users } from '@users/entity';

@Entity({ schema: 'public', name: 'transferencias' })
export class Transferencias {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transferencia?: Date;

  @Column('boolean', { default: false })
  pago?: boolean;

  @Column('integer', { default: 0 })
  valor!: number;

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
    name: 'carteira_origem_id',
  })
  @Exclude()
  carteiraOrigemId!: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'carteira_destino_id',
  })
  @Exclude()
  carteiraDestinoId!: number;

  @ManyToOne(() => Carteiras, carteiras => carteiras.transferenciaOrigem, {
    nullable: false,
  })
  @JoinColumn({ name: 'carteira_origem_id', referencedColumnName: 'id' })
  carteiraOrigem?: Carteiras;

  @ManyToOne(() => Carteiras, carteiras => carteiras.transferenciaDestino, {
    nullable: false,
  })
  @JoinColumn({ name: 'carteira_destino_id', referencedColumnName: 'id' })
  carteiraDestino?: Carteiras;

  @ManyToOne(() => Users, users => users.userTransferencia, {
    nullable: false,
  })
  @Exclude()
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: Users;

  constructor(
    userId: string,
    valor: number,
    carteiraOrigemId: number,
    carteiraDestinoId: number,
    transferencia?: Date,
    pago?: boolean,
  ) {
    this.userId = userId;
    this.valor = valor;
    this.carteiraOrigemId = carteiraOrigemId;
    this.carteiraDestinoId = carteiraDestinoId;
    this.transferencia = transferencia;
    this.pago = pago;
  }
  static build = ({
    userId,
    valor,
    carteiraDestinoId,
    carteiraOrigemId,
    transferencia,
    pago,
  }: Transferencias): Transferencias => {
    return new Transferencias(
      userId,
      valor,
      carteiraOrigemId,
      carteiraDestinoId,
      transferencia,
      pago,
    );
  };
}
