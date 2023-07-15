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

class UICPrefixHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        try {
            $profile = $request->getAttribute('profile', '');
            $hafas = Hafas::create($profile);

            $uicPrefixes = [];
            $uicPrefixes[] = [
                'prefix' => '0',
                'name' => '-',
            ];
            foreach ($hafas->getConfig()->getUICPrefixes() as $prefix => $name) {
                $uicPrefixes[] = [
                    'prefix' => $prefix,
                    'name' => $name
                ];
            }

            return new JsonResponse(
                $uicPrefixes,
                200,
                ['Cache-Control' => 'public, max-age=604800, must-revalidate']
            );
        } catch (InvalidProfileException $exception) {
            Http::throwBadRequest($exception->getMessage(), $exception);
        }
    }
}