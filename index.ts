import { IncomingMessage, ServerResponse } from 'http';

interface HidePoweredByOptions {
  setTo?: string;
}

export = function hidePoweredBy(options?: HidePoweredByOptions) {
  const { setTo = null } = options || {};

  if (setTo) {
    return function hidePoweredBy(_req: IncomingMessage, res: ServerResponse, next: () => void) {
      res.setHeader('X-Powered-By', setTo);
      next();
    };
  } else {
    return function hidePoweredBy(_req: IncomingMessage, res: ServerResponse, next: () => void) {
      res.removeHeader('X-Powered-By');
      next();
    };
  }
}
