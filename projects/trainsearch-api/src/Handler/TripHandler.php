<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Handler;

use Blue\TrainsearchApi\Hafas\Exception\BadRequestException;
use Blue\TrainsearchApi\Hafas\HafasRequest;
use Blue\TrainsearchApi\Http\CacheControl;
use Blue\HafasClient\Exception\InvalidProfileException;
use Blue\HafasClient\Filter\OperatorFilter;
use Blue\HafasClient\Filter\UICPrefixFilter;
use Blue\HafasClient\Hafas;
use Blue\HafasClient\Request\JourneyMatchRequest;
use Blue\Snappy\Core\Http;
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

        $journeyRequest = new JourneyMatchRequest($hafasRequest->getQuery());

        if ($hafasRequest->getOperator()) {
            $journeyRequest->setOperatorFilter(new OperatorFilter($hafasRequest->getOperator()));
        }

        if ($hafasRequest->getUicPrefix()) {
            $journeyRequest->setUicPrefixFilter(new UICPrefixFilter($hafasRequest->getUicPrefix()));
        }

        $data = $hafas->getTrips($journeyRequest);

        if (!isset($data[0]->id)) {
            Http::throwNotFound('Train not found');
        }

        return new Response\JsonResponse(
            $hafas->getTrip($data[0]->id),
            200,
            ['Cache-Control' => CacheControl::getHeaderValue(60)]
        );
    }
}