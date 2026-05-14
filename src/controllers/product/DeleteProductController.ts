import type { Request, Response, NextFunction } from 'express';
import type { IDeleteProductService } from '../../services/product/DeleteProductService';
import { parseProductIdParam } from './parseProductIdParam';

export class DeleteProductController {
  constructor(private readonly deleteProduct: IDeleteProductService) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseProductIdParam(req.params.id);
      await this.deleteProduct.execute(id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}
