<?php

namespace Blue\HafasClient\Models;

use JsonSerializable;

/**
 * @package HafasClient\Models
 */
readonly class Operator implements JsonSerializable
{
    public function __construct(
        public ?string $id = null,
        public ?string $name = null,
        public ?string $displayName = null,
        public ?string $uic = null
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'type' => 'operator',
            'id' => $this->id,
            'name' => $this->name,
            'displayName' => $this->displayName,
            'uic' => $this->uic
        ];
    }

    public function __toString(): string
    {
        return json_encode($this);
    }
}