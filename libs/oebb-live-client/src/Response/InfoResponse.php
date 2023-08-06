<?php

declare(strict_types=1);

namespace Blue\OebbLive\Response;

use Blue\OebbLive\Models\Vehicle;
use Blue\OebbLive\Models\Info;
use stdClass;

class InfoResponse
{
    public function __construct(private stdClass $raw)
    {
    }

    public function parse(): Info
    {
        $vehicles = [];
        foreach ($this->raw->train?->wagons ?? [] as $index => $wagon) {
            $vehicles[] = new Vehicle(
                uicNumber: $wagon->uicNumber ?? '',
                type: $wagon->kind ?? '',
                ranking: (int)($wagon->ranking ?? 0),
                locked: isset($wagon->isLocked) ? (bool)$wagon->isLocked : null,
                load: isset($this->raw?->load?->stats[$index]?->ratio) ? round($this->raw->load->stats[$index]->ratio * 100) : null
            );
        }

        return new Info($vehicles);
    }
}