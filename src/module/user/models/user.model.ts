import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from '../enums/type-user.enum';

@Entity()
export class UserModels {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'date' })
  public dateJoin: Date;

  @Column({ type: 'int' })
  public salary: number;

  @Column({ type: 'varchar', default: UserType.Salesman })
  public type: string = UserType.Salesman;

  @Column({ type: 'int', default: 1000 })
  public baseSalary: number = 1000;

  @ManyToMany(() => UserModels, (user) => user.subordinates)
  @JoinTable()
  public subordinates?: UserModels[];

  @ManyToMany(() => UserModels, (user) => user.supervisor)
  @JoinTable()
  public supervisor?: UserModels[];
}
