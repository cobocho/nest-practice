import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  return `${args.property}은 ${args.constraints[0]}에서 ${args.constraints[1]}자 사이여야합니다!`;
};
