<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Handler;

use Blue\OebbLive\Client\OebbLiveClient;
use Blue\OebbLive\Exception\NotFoundException;
use Blue\OebbLive\OebbLive;
use Blue\Snappy\Core\Http;
use Blue\TrainsearchApi\Http\CacheControl;
use DateTime;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CompositionHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $query = urldecode($request->getAttribute('query'));
        $station = $request->getQueryParams()['station'];
        $date = $request->getQueryParams()['date'] ?? null;
        $live = new OebbLive(new OebbLiveClient());

        $stations = $live->stations();
        if (!isset($stations[$station])) {
            Http::throwNotFound('Invalid station');
        }

        try {
            $info = $live->info(
                $query,
                $station,
                $date ? new DateTime($date) : new DateTime('today 00:00')
            );
        } catch (NotFoundException $exception) {
            Http::throwNotFound($exception->getMessage(), $exception);
        }

        return new JsonResponse(
            $info,
            200,
            ['Cache-Control' => CacheControl::getHeaderValue(3600)]
        );
    }
}