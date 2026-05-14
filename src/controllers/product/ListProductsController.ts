import type { Request, Response, NextFunction } from 'express';
import type { IListProductsService } from '../../services/product/ListProductsService';

export class ListProductsController {
  constructor(private readonly listProducts: IListProductsService) {}

  handle = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const lista = await this.listProducts.execute();
      res.json(lista);
    } catch (e) {
      next(e);
    }
  };
}
