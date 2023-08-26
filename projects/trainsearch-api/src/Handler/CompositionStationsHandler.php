<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Handler;

use Blue\TrainsearchApi\Http\CacheControl;
use Blue\HafasClient\Models\Stop;
use Blue\OebbLive\Client\OebbLiveClient;
use Blue\OebbLive\OebbLive;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CompositionStationsHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        if ((string)$request->getAttribute('profile') === 'oebb') {
            $live = new OebbLive(new OebbLiveClient());

            $stations = $live->stations();

            $stations = array_map(fn($station) => new Stop($station->eva, $station->name), $stations);
        } else {
            $stations = [];
        }
        
        return new JsonResponse(
            $stations,
            200,
            ['Cache-Control' => CacheControl::getHeaderValue(604800)]
        );
    }
}