<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Handler;

use Blue\HafasClient\Exception\InvalidProfileException;
use Blue\HafasClient\Filter\OperatorFilter;
use Blue\HafasClient\Filter\UICPrefixFilter;
use Blue\HafasClient\Hafas;
use Blue\HafasClient\Request\JourneyMatchRequest;
use Blue\Snappy\Core\Http;
use Blue\TrainsearchApi\Hafas\Exception\BadRequestException;
use Blue\TrainsearchApi\Hafas\HafasRequest;
use Laminas\Diactoros\Response;
use League\Route\Http\Exception\NotFoundException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class TripSearchHandler implements RequestHandlerInterface
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

        try {
            $data = $hafas->getTrips($journeyRequest);
        } catch (\Throwable $exception) {
            return new Response\JsonResponse(['hafasError' => json_decode($exception->getMessage())], 500);
        }

        if (!isset($data[0]->id)) {
            Http::throwNotFound('No result.');
        }

        return new Response\JsonResponse($data);
    }
}