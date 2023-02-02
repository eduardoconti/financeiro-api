import { AggregateRoot } from '@domain/base/contracts';
import { DateVO, Description, UUID } from '@domain/base/value-objects';

import { calculateResidual, descriptionOfInstalment } from './domain-services';

type ExpenseStatus = 'OPEN' | 'PAYED' | 'EXPIRED';

type Wallet = {
  id: string;
  description: string;
  paymentMethods: 'PIX' | 'DEBIT' | 'CREDIT' | 'BOLETO';
  billExpiration: DateVO;
};
type ExpensePayment = {
  id: string;
  dueDate: DateVO;
  type: string;
  value: number;
  paymentDate?: DateVO;
  wallet: Wallet;
};
export type ExpenseProps = {
  description: Description;
  value: number;
  status: ExpenseStatus;
  user: string;
  category: number;
  payment: ExpensePayment[];
};

export type ExpensePrimitiveProps = {
  description: string;
  value: number;
  vencimento: Date;
  status: ExpenseStatus;
  user: string;
  category: number;
  payment: ExpensePayment;
};
export class Expense extends AggregateRoot<ExpenseProps> {
  protected readonly _id!: UUID;

  static create(expenseProps: ExpensePrimitiveProps): Expense {
    const id = UUID.generate();
    const entity = new Expense({
      id,
      props: {
        ...expenseProps,
        payment: [expenseProps.payment],
        description: new Description(expenseProps.description),
      },
    });

    if (expenseProps.status === 'PAYED') {
      entity.payExpense;
    }
    return entity;
  }

  applyInstallment(installment: number): Expense[] {
    const installmentValue = this.props.value / installment;
    let residual = 0;
    if (!Number.isInteger(installmentValue)) {
      residual = calculateResidual(this.props.value, installment);
    }

    this.props.value = installmentValue + residual;
    this.props.description = new Description(
      descriptionOfInstalment(1, installment, this.props.description.value),
    );

    const data: Expense[] = [];
    for (let index = 2; index <= installment; index++) {
      const id = UUID.generate();
      const entity = new Expense({
        id,
        props: {
          ...this.props,
          description: new Description(
            descriptionOfInstalment(
              index,
              installment,
              this.props.description.value,
            ),
          ),
          value: installmentValue,
        },
      });

      data.push(entity);
    }
    return [this, ...data];
  }

  payExpense(): void {
    this.props.status = 'PAYED';
    //this.props.payment.paymentDate = DateVO.now();
  }

  isPayed(): boolean {
    return this.props.status === 'PAYED';
  }
}
