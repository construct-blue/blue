<?php

declare(strict_types=1);

namespace Blue\OebbLive\Models;

use JsonSerializable;

class Vehicle implements JsonSerializable
{
    public function __construct(
        public string $uicNumber,
        public string $type,
        public int    $ranking,
        public ?bool  $locked = null,
        public ?float $load = null
    )
    {
    }

    public function jsonSerialize(): mixed
    {
        return [
            'uicNumber' => $this->uicNumber,
            'type' => $this->type,
            'ranking' => $this->ranking,
            'locked' => $this->locked,
            'load' => $this->load
        ];
    }
}