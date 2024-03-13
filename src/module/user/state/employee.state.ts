import { UserType } from '../enums/type-user.enum';
import { UserModels } from '../models/user.model';
import { UserAbstractState } from './abstract.state';

export class EmployeeState extends UserAbstractState {
  protected percentageSalary = 0.03;
  protected highestPercentageSalary = 0.3;

  public getSalary(dateJoin: Date, baseSalary: number): number {
    const yearsWorked =
      new Date().getFullYear() - new Date(dateJoin).getFullYear();

    const salaryIncreasePercentage = Math.min(
      this.percentageSalary * yearsWorked,
      this.highestPercentageSalary,
    );

    return Math.round(baseSalary * (1 + salaryIncreasePercentage));
  }
  public setSupervisor(usersArray: UserModels[]) {
    const subordinates = usersArray.map((user) => {
      if (user.type === UserType.Salesman || user.type === UserType.Manager)
        return user;
      throw Error('Subordinate not relevant');
    });
    return subordinates;
  }
  public setSubordinates() {
    throw Error('Employee has no subordinates');
  }
}
