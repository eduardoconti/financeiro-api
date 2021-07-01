import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/users/entity/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Carteiras } from '../../carteiras/entity/carteiras.entity';
@Entity({ schema: 'public', name: 'transferencias' })
export class Transferencias {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transferencia: Date;

  @Column('boolean', { default: false })
  pago: boolean;

  @Column('float', { default: 0 })
  valor: number;

  @ManyToOne(() => Carteiras, (carteiras) => carteiras.transferenciaOrigem, {
    nullable: false,
  })
  carteiraOrigem: Carteiras;

  @ManyToOne(() => Carteiras, (carteiras) => carteiras.transferenciaDestino, {
    nullable: false,
  })
  carteiraDestino: Carteiras;

  @ManyToOne(() => Users, (users) => users.userTransferencia, {
    nullable: false,
  })
  user: Users;
}
