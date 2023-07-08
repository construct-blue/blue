<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Handler;

use Blue\HafasClient\Hafas;
use Blue\HafasClient\Request\JourneyMatchRequest;
use Blue\OebbLive\Client\OebbLiveClient;
use Blue\OebbLive\OebbLive;
use Blue\Snappy\Core\Http;
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

        $live = new OebbLive(new OebbLiveClient());
        $info = $live->info(
            $query,
            $request->getQueryParams()['station'],
            new DateTime('today 00:00')
        );

        return new JsonResponse($info);
    }
}