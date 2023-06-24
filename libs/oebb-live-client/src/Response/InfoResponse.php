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
        return new Info(array_map(
                fn($wagon) => new Vehicle(
                    uicNumber: $wagon->uicNumber ?? '',
                    type: $wagon->kind ?? '',
                    ranking: (int)($wagon->ranking ?? 0)
                ),
                $this->raw->train?->wagons ?? [])
        );
    }
}