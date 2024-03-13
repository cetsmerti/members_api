import { UserType } from '../enums/type-user.enum';
import { UserModels } from '../models/user.model';
import { UserAbstractState } from '../state/abstract.state';
import { EmployeeState } from '../state/employee.state';
import { ManagerState } from '../state/manager.state';
import { SalesmanState } from '../state/salesmen.state';

export class UserEntity {
  public name: string;
  public dateJoin: Date;
  public salary: number;
  public type: string;
  public state: UserAbstractState;
  public baseSalary: number;
  public supervisor?: UserModels[];
  public subordinates?: UserModels[];
  public id: string;

  constructor({
    name,
    dateJoin,
    type,
    baseSalary,
    supervisor,
    subordinates,
  }: UserModels) {
    this.name = name;
    this.dateJoin = dateJoin;
    this.type = type;
    this.baseSalary = baseSalary;
    this.createState();
    this.salary = this.state.getSalary(dateJoin, baseSalary);
    this.supervisor = supervisor;
    this.subordinates = subordinates;
  }

  private createState(): void {
    switch (this.type) {
      case UserType.Manager:
        this.state = new ManagerState();
        break;
      case UserType.Employee:
        this.state = new EmployeeState();
        break;
      case UserType.Salesman:
        this.state = new SalesmanState();
        break;
    }
  }
  public setSupervisor(usersArray: UserModels[]): void {
    const newSupervisor = this.state.setSupervisor(usersArray);
    if (this.supervisor) {
      this.supervisor.push(...(newSupervisor as UserModels[]));
    } else {
      this.supervisor = newSupervisor as UserModels[];
    }

    this.salary = this.state.getSalary(
      this.dateJoin,
      this.baseSalary,
      this.subordinates,
    );
  }
  public setSubordinates(usersArray: UserModels[]): void {
    const newSubordinates = this.state.setSubordinates(usersArray);
    if (this.subordinates) {
      this.subordinates.push(...(newSubordinates as UserModels[]));
    } else {
      this.subordinates = newSubordinates as UserModels[];
    }

    this.salary = this.state.getSalary(
      this.dateJoin,
      this.baseSalary,
      this.subordinates,
    );
  }
}
