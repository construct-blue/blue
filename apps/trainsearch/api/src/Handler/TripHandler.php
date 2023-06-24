<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Handler;

use Blue\HafasClient\Exception\InvalidProfileException;
use Blue\HafasClient\Hafas;
use Blue\HafasClient\Helper\OperatorFilter;
use Blue\HafasClient\Request\JourneyMatchRequest;
use Blue\TrainsearchApi\Hafas\Exception\BadRequestException;
use Blue\TrainsearchApi\Hafas\HafasRequest;
use DateTime;
use Laminas\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class TripHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        try {
            $hafasRequest = new HafasRequest($request);
            $hafas = Hafas::create($hafasRequest->getProfile());
        } catch (BadRequestException|InvalidProfileException $exception) {
            return new Response\JsonResponse(['error' => $exception->getMessage()], 400);
        }

        $journeyRequest = new JourneyMatchRequest($hafasRequest->getQuery(), false);
        $journeyRequest->setAdmin($hafasRequest->getQuery());
        $journeyRequest->setFromWhen(new DateTime('today 00:00'));
        $journeyRequest->setUntilWhen(new DateTime('today 23:59'));

        if ($hafasRequest->getOperator()) {
            $journeyRequest->setOperatorFilter(new OperatorFilter($hafasRequest->getOperator()));
        }

        $data = $hafas->tripsByName($journeyRequest);

        if (!isset($data[0]->id)) {
            return new Response\JsonResponse(['error' => 'Train not found.'], 404);
        }

        if (isset($data[1])) {
            return new Response\JsonResponse(['error' => 'Query did not result in a unique train.'], 400);
        }

        return new Response\JsonResponse($hafas->trip($data[0]->id));
    }
}