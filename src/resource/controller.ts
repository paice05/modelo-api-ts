import { Request, Response } from 'express';

interface IRequest extends Request {
  user: any;
  consumidorId: string;
  lojistaId: string;
}

export default <T>(resource: any) => {
  const index = async (req: Request, res: Response) => {
    const { query } = req;

    try {
      const response = await resource
        .findMany(query)
        .then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  const show = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { query } = req;

    try {
      const response = await resource
        .findById(id, query)
        .then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  const create = async (req: IRequest, res: Response) => {
    const { body, query, consumidorId, lojistaId, user } = req;

    try {
      const response = await resource
        .create(
          {
            consumidorId,
            lojistaId,
            usuario: user,
            ...body,
          },
          query
        )
        .then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body, query } = req;

    try {
      const response = await resource
        .updateById(id, body, query)
        .then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  const destroy = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const response = await resource
        .destroyById(id)
        .then((data: Partial<T>) => !!data);

      return res.json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  return {
    index,
    show,
    create,
    update,
    destroy,
  };
};
