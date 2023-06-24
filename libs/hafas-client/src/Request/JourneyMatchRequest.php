<?php

declare(strict_types=1);

namespace Blue\HafasClient\Request;

use DateTime;
use Blue\HafasClient\Helper\OperatorFilter;
use Blue\HafasClient\Helper\ProductFilter;
use Blue\HafasClient\Helper\Time;
use Blue\HafasClient\Models\Trip;
use Blue\HafasClient\Profile\Config;

class JourneyMatchRequest
{
    private string $query;
    private DateTime $fromWhen;
    private DateTime $untilWhen;
    private bool $onlyCurrentlyRunning;
    private ProductFilter $productFilter;
    private OperatorFilter $operatorFilter;

    private ?string $admin = null;

    /**
     * @param string $query
     * @param bool $onlyCurrentlyRunning
     */
    public function __construct(string $query, bool $onlyCurrentlyRunning)
    {
        $this->query = $query;
        $this->onlyCurrentlyRunning = $onlyCurrentlyRunning;
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
     * @param DateTime $fromWhen
     * @return JourneyMatchRequest
     */
    public function setFromWhen(DateTime $fromWhen): JourneyMatchRequest
    {
        $this->fromWhen = $fromWhen;
        return $this;
    }

    /**
     * @param DateTime $untilWhen
     * @return JourneyMatchRequest
     */
    public function setUntilWhen(DateTime $untilWhen): JourneyMatchRequest
    {
        $this->untilWhen = $untilWhen;
        return $this;
    }

    /**
     * @param bool $onlyCurrentlyRunning
     * @return JourneyMatchRequest
     */
    public function setOnlyCurrentlyRunning(bool $onlyCurrentlyRunning): JourneyMatchRequest
    {
        $this->onlyCurrentlyRunning = $onlyCurrentlyRunning;
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
     * @param string|null $admin
     * @return JourneyMatchRequest
     */
    public function setAdmin(?string $admin): JourneyMatchRequest
    {
        $this->admin = $admin;
        return $this;
    }

    private function getAdmins(Config $config): array
    {
        if (isset($this->operatorFilter)) {
            $result = $this->operatorFilter->admins($config);
        } else {
            $result = [];

        }
        if (isset($this->admin)) {
            $result[] = $this->admin;
        }

        return $result;
    }


    /**
     * @param Trip[] $trips
     * @return Trip[]
     */
    public function filter(Config $config, array $trips): array
    {
        $admins = $this->getAdmins($config);
        if ($admins !== []) {
            foreach ($trips as $i => $trip) {
                if (!in_array($trip->line->admin, $admins)) {
                    unset($trips[$i]);
                }
            }
        }
        return array_values($trips);
    }

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
                'onlyCR' => $this->onlyCurrentlyRunning,
                'jnyFltrL' => [$this->productFilter->filter()],
            ],
        ];

        if (isset($this->operatorFilter)) {
            $data['req']['jnyFltrL'][] = $this->operatorFilter->filter($config);
        }

        if (isset($this->fromWhen)) {
            $data['req']['dateB'] = Time::formatDate($this->fromWhen);
            $data['req']['timeB'] = Time::formatTime($this->fromWhen);
        }
        if (isset($this->untilWhen)) {
            $data['req']['dateE'] = Time::formatDate($this->untilWhen);
            $data['req']['timeE'] = Time::formatTime($this->untilWhen);
        }

        return $data;
    }
}