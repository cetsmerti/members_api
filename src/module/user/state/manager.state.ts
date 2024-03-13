import { UserType } from '../enums/type-user.enum';
import { UserModels } from '../models/user.model';
import { UserAbstractState } from './abstract.state';

export class ManagerState extends UserAbstractState {
  protected percentageSalary = 0.05;
  protected highestPercentageSalary = 0.4;
  protected procentageSubordinatesSalary = 0.005;

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
    return (
      usersArray?.filter((user) => user.type === UserType.Employee).length || 0
    );
  }
  public setSupervisor(usersArray: UserModels[]) {
    const supervisor = usersArray.map((user) => {
      if (user.type === UserType.Employee)
        throw Error('Not correct supervisor');
      return user;
    });
    return supervisor;
  }
  public setSubordinates(usersArray: UserModels[]) {
    const subordinates = usersArray;
    return subordinates;
  }
}
