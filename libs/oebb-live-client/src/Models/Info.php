<?php

declare(strict_types=1);

namespace Blue\OebbLive\Models;

use JsonSerializable;

class Info implements JsonSerializable
{
    /**
     * @param Vehicle[] $vehicles
     */
    public function __construct(
        public array $vehicles
    )
    {
    }

    public function jsonSerialize(): mixed
    {
        return [
            'vehicles' => $this->vehicles,
        ];
    }
}