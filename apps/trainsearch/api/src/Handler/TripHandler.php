<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Handler;

use Blue\HafasClient\Exception\InvalidProfileException;
use Blue\HafasClient\Hafas;
use Blue\HafasClient\Helper\OperatorFilter;
use Blue\HafasClient\Request\JourneyMatchRequest;
use Blue\Snappy\Core\Http;
use Blue\TrainsearchApi\Hafas\Exception\BadRequestException;
use Blue\TrainsearchApi\Hafas\HafasRequest;
use DateTime;
use Laminas\Diactoros\Response;
use League\Route\Http\Exception\NotFoundException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class TripHandler implements RequestHandlerInterface
{
    /**
     * @param ServerRequestInterface $request
     * @return ResponseInterface
     * @throws \Blue\HafasClient\Exception\InvalidHafasResponse
     * @throws \GuzzleHttp\Exception\GuzzleException
     * @throws \League\Route\Http\Exception\BadRequestException
     * @throws NotFoundException
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        try {
            $hafasRequest = new HafasRequest($request);
            $hafas = Hafas::create($hafasRequest->getProfile());
        } catch (BadRequestException|InvalidProfileException $exception) {
            Http::throwBadRequest($exception->getMessage(), $exception);
        }

        $journeyRequest = new JourneyMatchRequest($hafasRequest->getQuery(), false);
        $journeyRequest->setAdmin($hafasRequest->getAdmin());
        $journeyRequest->setFromWhen(new DateTime('today 00:00'));
        $journeyRequest->setUntilWhen(new DateTime('today 23:59'));

        if ($hafasRequest->getOperator()) {
            $journeyRequest->setOperatorFilter(new OperatorFilter($hafasRequest->getOperator()));
        }

        $data = $hafas->tripsByName($journeyRequest);

        if (!isset($data[0]->id)) {
            Http::throwNotFound('Train not found');
        }

        return new Response\JsonResponse(
            $hafas->trip($data[0]->id),
            200,
            ['Cache-Control' => 'public, max-age=60, must-revalidate']
        );
    }
}