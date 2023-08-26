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
    private ?int $uicPrefix = null;

    /**
     * @param ServerRequestInterface $request
     * @throws Blue\TrainsearchApi\Hafas\Exception\BadRequestException
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
        if (isset($queryParams['uicPrefix'])) {
            $this->uicPrefix = (int)$queryParams['uicPrefix'];
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

    /**
     * @return int|null
     */
    public function getUicPrefix(): ?int
    {
        return $this->uicPrefix;
    }
}