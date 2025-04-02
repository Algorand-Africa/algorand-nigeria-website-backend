import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import dataSource from '../../../config/orm.config';

export function IsUnique(
  entityClass: any,
  field: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityClass, field],
      validator: IsUniqueConstraint,
    });
  };
}

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entityClass, field] = args.constraints;
    const repository = dataSource.getRepository(entityClass);

    return !(await repository.findOneBy({ [field]: value }));
  }

  defaultMessage(args: ValidationArguments): string {
    const [_, field] = args.constraints;
    return `${field} is already taken.`;
  }
}
