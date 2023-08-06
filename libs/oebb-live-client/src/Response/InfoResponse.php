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
        $load = [];

        foreach ($this->raw?->load?->stats ?? [] as $stat) {
            if (isset($stat->ranking) && isset($stat->ratio)) {
                $load[(int)$stat->ranking] = round($stat->ratio * 100);
            }
        }

        $vehicles = [];
        foreach ($this->raw->train?->wagons ?? [] as $index => $wagon) {
            $ranking = (int)($wagon->ranking ?? 0);
            $vehicles[] = new Vehicle(
                uicNumber: $wagon->uicNumber ?? '',
                type: $wagon->kind ?? '',
                ranking: $ranking,
                locked: isset($wagon->isLocked) ? (bool)$wagon->isLocked : null,
                load: $load[$ranking] ?? null
            );
        }

        return new Info($vehicles);
    }
}