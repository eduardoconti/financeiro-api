import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/user/entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Carteiras } from '@wallet/entity';

@Entity({ schema: 'public', name: 'transferencias' })
export class Transferencias {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transferencia!: Date;

  @Column('boolean', { default: false })
  pago!: boolean;

  @Column('float', { default: 0 })
  valor!: number;

  @ManyToOne(() => Carteiras, (carteiras) => carteiras.transferenciaOrigem, {
    nullable: false,
  })
  carteiraOrigem!: number;

  @ManyToOne(() => Carteiras, (carteiras) => carteiras.transferenciaDestino, {
    nullable: false,
  })
  carteiraDestino!: number;

  @ManyToOne(() => Users, (users) => users.userTransferencia, {
    nullable: false,
  })
  user!: string;
}
