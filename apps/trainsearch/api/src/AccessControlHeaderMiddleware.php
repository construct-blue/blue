<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AccessControlHeaderMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if (str_ends_with($request->getUri()->getHost(), '.local')) {
            $domain = 'https://trainsearch.local';
        } else {
            $domain = 'https://trainsearch.snappy.blue';
        }
       return $handler->handle($request)
           ->withHeader('Access-Control-Allow-Origin', $domain);
    }
}