<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi;

use DateTime;
use HafasClient\Hafas;
use HafasClient\Helper\OperatorFilter;
use HafasClient\Request\JourneyMatchRequest;
use Laminas\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class TripHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $query = urldecode($request->getAttribute('query'));
        $profile = $request->getAttribute('profile', 'db');
        $admin = $request->getQueryParams()['admin'] ?? null;
        if ($profile == 'db') {
            $hafas = Hafas::createDB();
        } elseif ($profile == 'oebb') {
            $hafas = Hafas::createOeBB();
        } else {
            return new Response\JsonResponse(['error' => 'Invalid profile.'], 400);
        }

        $journeyRequest = new JourneyMatchRequest($query, false);
        $journeyRequest->setAdmin($admin);

        $journeyRequest->setFromWhen(new DateTime('today 00:00'));
        $journeyRequest->setUntilWhen(new DateTime('today 23:59'));

        $operator = $request->getQueryParams()['operator'] ?? null;
        if ($operator) {
            $operator = (array)$operator;
            $journeyRequest->setOperatorFilter(new OperatorFilter(...$operator));
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