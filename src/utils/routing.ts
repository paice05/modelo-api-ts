import { Router, Request, Response, NextFunction } from 'express';
import { ServerResponse } from 'http';

interface IRequest extends Request {
  serviceId: string;
}

type HandlerFunction = (
  req: IRequest,
  res: Response,
  next?: NextFunction
) => Promise<any> | ServerResponse | any;

export const promiseHandler = (fn: HandlerFunction) => (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const resultOrPromise = fn(req, res, next);

  // >2 args is a middleware with next
  if (fn.length > 2) return;

  // return res.something()
  if (resultOrPromise instanceof ServerResponse) {
    return;
  }

  // return Promise
  if (resultOrPromise && resultOrPromise.then) {
    resultOrPromise
      .then((result: any) => {
        if (result === true) {
          res.sendStatus(200);
          return;
        }
        res.json(result);
      })
      .catch((err: any) => next(err));

    return;
  }

  console.warn(
    'Something else then Promise or ServerResponse returned from controller method.',
    resultOrPromise
  );
  res.send(resultOrPromise);
};
