<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Handler;

use Blue\OebbLive\Client\OebbLiveClient;
use Blue\OebbLive\Exception\NotFoundException;
use Blue\OebbLive\OebbLive;
use Blue\Snappy\Core\Http;
use DateTime;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CompositionStationsHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $live = new OebbLive(new OebbLiveClient());

        $stations = $live->stations();

        return new JsonResponse(
            $stations,
            200,
            ['Cache-Control' => 'public, max-age=3600, must-revalidate']
        );
    }
}