import type { Request, Response, NextFunction } from 'express';
import type { IUpdateProductService } from '../../services/product/UpdateProductService';
import { parseProductIdParam } from './parseProductIdParam';

export class UpdateProductController {
  constructor(private readonly updateProduct: IUpdateProductService) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseProductIdParam(req.params.id);
      const atualizado = await this.updateProduct.execute(id, req.body);
      res.json(atualizado);
    } catch (e) {
      next(e);
    }
  };
}
