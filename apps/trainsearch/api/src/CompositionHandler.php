<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi;

use Blue\OebbLive\Client\OebbLiveClient;
use Blue\OebbLive\OebbLive;
use DateTime;
use Blue\HafasClient\Hafas;
use Blue\HafasClient\Request\JourneyMatchRequest;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CompositionHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $hafas = Hafas::createOeBB();
        $query = urldecode($request->getAttribute('query'));

        $journeyRequest = new JourneyMatchRequest($query, false);
        $journeyRequest->setAdmin('81');
        $journeyRequest->setFromWhen(new DateTime('today 00:00'));
        $journeyRequest->setUntilWhen(new DateTime('today 23:59'));

        $data = $hafas->tripsByName($journeyRequest);
        if (isset($data[0])) {
            $originStationId = $data[0]->stopovers[0]->stop->id;
            $live = new OebbLive(new OebbLiveClient());
            $info = $live->info(
                $data[0]->line->number,
                $request->getQueryParams()['station'] ?? $originStationId,
                $data[0]->date
            );
            return new JsonResponse($info);
        }

        return new JsonResponse(['error' => 'Train not found.'], 404);
    }
}