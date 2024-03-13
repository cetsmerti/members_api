import { UserType } from '../enums/type-user.enum';
import { UserModels } from '../models/user.model';

export abstract class UserAbstractState {
  protected _type: UserType;
  protected percentageSalary: number;
  protected highestPercentageSalary: number;
  protected procentageSubordinatesSalary: number;

  public setState(type: UserType) {
    this._type = type;
  }
  public abstract getSalary(
    dateJoin: Date,
    baseSalary: number,
    subordinates?: UserModels[],
  ): number;
  public abstract setSupervisor(usersArray: UserModels[]);
  public abstract setSubordinates(usersArray: UserModels[]);
}
