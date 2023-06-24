<?php

declare(strict_types=1);

namespace Blue\OebbLive\Request;

use DateTime;

class InfoRequest
{
    public function __construct(
        private string $trainNr, private string $stationId, private DateTime $date
    )
    {
    }

    /**
     * @return array<mixed>
     */
    public function getParams(): array
    {
        return [
            'trainNr' => $this->trainNr,
            'station' => $this->stationId,
            'date' => $this->date->format('Y-m-d'),
        ];
    }

    public function getEndpoint(): string
    {
        return '/info';
    }
}