import connect from 'connect';
import request from 'supertest';
import { IncomingMessage, ServerResponse } from 'http';

import hidePoweredBy = require('..');

describe('hidePoweredBy', () => {
  function app(middleware: ReturnType<typeof hidePoweredBy>): connect.Server {
    const result = connect();
    result.use(middleware);
    result.use((_req: IncomingMessage, res: ServerResponse) => {
      res.end('Hello world!');
    });
    return result;
  }

  it('works even if no header is set', async () => {
    await request(app(hidePoweredBy())).get('/').then((response: request.Response) => {
      expect(response.header['x-powered-by']).toEqual(undefined);
    });
  });

  it('removes the X-Powered-By header when no arguments are passed', async () => {
    await request(app(hidePoweredBy())).get('/').then((response: request.Response) => {
      expect(response.header).not.toHaveProperty('x-powered-by');
    });
  });

  it('removes the X-Powered-By header when empty options are passed', async () => {
    await request(app(hidePoweredBy({}))).get('/').then((response: request.Response) => {
      expect(response.header).not.toHaveProperty('x-powered-by');
    });
  });

  it('allows you to explicitly set the header', async () => {
    await request(app(hidePoweredBy({ setTo: 'steampowered' })))
      .get('/')
      .expect('X-Powered-By', 'steampowered');
  });

  it('names its function and middleware', () => {
    expect(hidePoweredBy.name).toBe('hidePoweredBy');
    expect(hidePoweredBy().name).toBe('hidePoweredBy');
  });

});
