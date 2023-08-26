<?php

namespace Blue\HafasClient\Models;

/**
 * @package HafasClient\Models
 */
readonly class Stop implements \JsonSerializable
{
    public function __construct(
        public string    $id,
        public string    $name,
        public ?Location $location = null
    )
    {
    }

    public function jsonSerialize(): mixed
    {
        return [
            'type' => 'stop',
            'id' => $this->id,
            'name' => $this->name,
            'location' => $this->location ?? null
        ];
    }

    public function __toString(): string
    {
        return json_encode($this);
    }
}