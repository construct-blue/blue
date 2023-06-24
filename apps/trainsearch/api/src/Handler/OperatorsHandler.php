<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Handler;

use Blue\HafasClient\Exception\InvalidProfileException;
use Blue\HafasClient\Hafas;
use Blue\Snappy\Core\Http;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class OperatorsHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        try {
            $profile = $request->getAttribute('profile', '');
            $hafas = Hafas::create($profile);
            return new JsonResponse($hafas->getConfig()->getOperators());
        } catch (InvalidProfileException $exception) {
            Http::throwBadRequest($exception->getMessage(), $exception);
        }
    }
}