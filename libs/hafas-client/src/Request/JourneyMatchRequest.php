<?php

declare(strict_types=1);

namespace Blue\HafasClient\Request;

use Blue\HafasClient\Exception\InvalidFilterException;
use Blue\HafasClient\Exception\ProductNotFoundException;
use DateTime;
use Blue\HafasClient\Helper\OperatorFilter;
use Blue\HafasClient\Helper\ProductFilter;
use Blue\HafasClient\Helper\Time;
use Blue\HafasClient\Models\Trip;
use Blue\HafasClient\Profile\Config;

class JourneyMatchRequest
{
    private string $query;
    private ProductFilter $productFilter;
    private OperatorFilter $operatorFilter;

    /**
     * @param string $query
     */
    public function __construct(string $query)
    {
        $this->query = $query;
        $this->productFilter = new ProductFilter();
    }


    /**
     * @param string $query
     * @return JourneyMatchRequest
     */
    public function setQuery(string $query): JourneyMatchRequest
    {
        $this->query = $query;
        return $this;
    }

    /**
     * @param ProductFilter $productFilter
     * @return JourneyMatchRequest
     */
    public function setProductFilter(ProductFilter $productFilter): JourneyMatchRequest
    {
        $this->productFilter = $productFilter;
        return $this;
    }

    /**
     * @param OperatorFilter $operatorFilter
     * @return JourneyMatchRequest
     */
    public function setOperatorFilter(OperatorFilter $operatorFilter): JourneyMatchRequest
    {
        $this->operatorFilter = $operatorFilter;
        return $this;
    }


    /**
     * @param Config $config
     * @return array<mixed>
     * @throws InvalidFilterException
     * @throws ProductNotFoundException
     */
    public function toArray(Config $config): array
    {
        $data = [
            'cfg' => [
                'polyEnc' => 'GPA',
                'rtMode' => 'REALTIME',
            ],
            'meth' => 'JourneyMatch',
            'req' => [
                'input' => $this->query,
                'extId' => $this->query,
                'tripId' => null,
                'onlyTN' => true,
                'onlyRT' => false,
                'onlyCR' => false,
                'useAeqi' => false,
                'date' => Time::formatDate(new DateTime('today 00:00')),
                'jnyFltrL' => [
                    $this->productFilter->filter($config),
                    [
                        'type' => 'NUM',
                        'mode' => 'INC',
                        'value' => $this->query
                    ],
                ],
            ],
        ];

        if (isset($this->operatorFilter)) {
            $data['req']['jnyFltrL'][] = $this->operatorFilter->filter($config);
        }

        return $data;
    }
}