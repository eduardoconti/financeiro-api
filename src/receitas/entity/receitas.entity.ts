import { Exclude } from 'class-transformer';
import { Users } from 'src/users/entity/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Carteiras } from '../../carteiras/entity/carteiras.entity';
@Entity({ schema: 'public', name: 'receitas' })
export class Receitas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  descricao: string;

  @Column('float', { default: 0 })
  valor: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  pagamento: Date;

  @Column('boolean', { default: false })
  pago: boolean;

  @ManyToOne(() => Carteiras, (carteiras) => carteiras.id, { nullable: false })
  carteira: Carteiras;

  @ManyToOne(() => Users, (users) => users.id, { nullable: false })
  @Exclude()
  user: Users;
}
