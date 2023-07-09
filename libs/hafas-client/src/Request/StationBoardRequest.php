<?php

declare(strict_types=1);

namespace Blue\HafasClient\Request;

use Blue\HafasClient\Filter\ProductFilter;
use Blue\HafasClient\Helper\Time;
use Blue\HafasClient\Profile\Config;
use DateTime;
use DateTimeZone;

class StationBoardRequest implements HafasRequestInterface
{
    private ProductFilter $productFilter;

    public function __construct(private string $type, private string $id)
    {
        $this->productFilter = new ProductFilter();
    }

    public function toArray(Config $config): array
    {
        $dateTime = new DateTime('now', new DateTimeZone('Europe/Vienna'));
        $data = [
            'req' => [
                'type' => $this->type,
                'stbLoc' => [
                    'lid' => 'A=1@L=' . $this->id . '@',
                ],
                'maxJny' => 10,
                'date' => Time::formatDate($dateTime),
                'time' => Time::formatTime($dateTime),
                'dur' => -1,
                'jnyFltrL' => [
                    $this->productFilter->filter($config)
                ]
            ],
            'meth' => 'StationBoard'
        ];

        return $data;
    }
}