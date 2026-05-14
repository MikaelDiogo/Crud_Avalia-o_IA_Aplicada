import { AppError } from '../../../errors/AppError';

export function assertValidProductId(id: number): void {
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, 'Identificador de produto inválido.');
  }
}
