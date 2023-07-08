<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Hafas;

use Blue\TrainsearchApi\Hafas\Exception\BadRequestException;
use Psr\Http\Message\ServerRequestInterface;

class HafasRequest
{
    private string $profile;
    private string $query;
    private ?string $operator = null;

    /**
     * @param ServerRequestInterface $request
     * @throws BadRequestException
     */
    public function __construct(ServerRequestInterface $request)
    {
        if (!$request->getAttribute('profile')) {
            throw new BadRequestException('Missing profile attribute in request.');
        }
        if (!$request->getAttribute('query')) {
            throw new BadRequestException('Missing profile query in request.');
        }
        $this->profile = (string)$request->getAttribute('profile');
        $this->query = rawurldecode((string)$request->getAttribute('query'));

        $queryParams = $request->getQueryParams();
        if (isset($queryParams['operator'])) {
            $this->operator = (string)$queryParams['operator'];
        }
    }

    /**
     * @return string
     */
    public function getProfile(): string
    {
        return $this->profile;
    }

    /**
     * @return string
     */
    public function getQuery(): string
    {
        return $this->query;
    }

    /**
     * @return string|null
     */
    public function getOperator(): ?string
    {
        return $this->operator;
    }
}