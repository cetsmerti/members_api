import { UserType } from '../enums/type-user.enum';
import { UserModels } from '../models/user.model';
import { UserAbstractState } from './abstract.state';

export class SalesmanState extends UserAbstractState {
  protected percentageSalary = 0.01;
  protected highestPercentageSalary = 0.35;
  protected procentageSubordinatesSalary = 0.003;

  public getSalary(
    dateJoin: Date,
    baseSalary: number,
    subordinates: UserModels[],
  ): number {
    const yearsWorked =
      new Date().getFullYear() - new Date(dateJoin).getFullYear();
    const salaryIncreasePercentage = Math.min(
      this.percentageSalary * yearsWorked,
      this.highestPercentageSalary,
    );
    const subordinatesSalaryPercentage =
      this.procentageSubordinatesSalary *
      this.getNumberFirstLevelSubordinates(subordinates);
    return Math.round(
      baseSalary *
        (1 + salaryIncreasePercentage) *
        (1 + subordinatesSalaryPercentage),
    );
  }

  private getNumberFirstLevelSubordinates(usersArray: UserModels[]) {
    return usersArray?.length || 0;
  }

  public setSupervisor(usersArray: UserModels[]) {
    const subordinates = usersArray?.map((user) => {
      if (user.type === UserType.Employee)
        throw Error('Not correct supervisor');
      return user;
    });
    return subordinates;
  }
  public setSubordinates(usersArray: UserModels[]) {
    const subordinates = usersArray;
    return subordinates;
  }
}
