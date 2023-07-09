<?php

declare(strict_types=1);

namespace Blue\HafasClient\Request;

use Blue\HafasClient\Exception\InvalidFilterException;
use Blue\HafasClient\Filter\OperatorFilter;
use Blue\HafasClient\Filter\ProductFilter;
use Blue\HafasClient\Filter\UICPrefixFilter;
use Blue\HafasClient\Helper\Time;
use Blue\HafasClient\Profile\Config;
use DateTime;

class JourneyMatchRequest implements HafasRequestInterface
{
    private string $query;
    private ProductFilter $productFilter;
    private UICPrefixFilter $uicPrefixFilter;
    private OperatorFilter $operatorFilter;

    private bool $onlyRT = true;
    private bool $onlyTN = true;



    /**
     * @param string $query
     */
    public function __construct(string $query)
    {
        $this->query = $query;
        $this->productFilter = new ProductFilter();
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
     * @param UICPrefixFilter $uicPrefixFilter
     * @return JourneyMatchRequest
     */
    public function setUicPrefixFilter(UICPrefixFilter $uicPrefixFilter): JourneyMatchRequest
    {
        $this->uicPrefixFilter = $uicPrefixFilter;
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
     * @param bool $onlyRT
     * @return JourneyMatchRequest
     */
    public function setOnlyRT(bool $onlyRT): JourneyMatchRequest
    {
        $this->onlyRT = $onlyRT;
        return $this;
    }

    /**
     * @param bool $onlyTN
     * @return JourneyMatchRequest
     */
    public function setOnlyTN(bool $onlyTN): JourneyMatchRequest
    {
        $this->onlyTN = $onlyTN;
        return $this;
    }

    /**
     * @param Config $config
     * @return array<mixed>
     * @throws InvalidFilterException
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
                'onlyTN' => $this->onlyTN,
                'onlyRT' => $this->onlyRT,
                'onlyCR' => false,
                'useAeqi' => true,
                'date' => Time::formatDate(new DateTime('today 00:00')),
                'jnyFltrL' => [
                    $this->productFilter->filter($config),
                ],
            ],
        ];

        if (isset($this->operatorFilter)) {
            $data['req']['jnyFltrL'][] = $this->operatorFilter->filter($config);
        }

        if (isset($this->uicPrefixFilter)) {
            $data['req']['jnyFltrL'][] = $this->uicPrefixFilter->filter();
        }

        return $data;
    }
}