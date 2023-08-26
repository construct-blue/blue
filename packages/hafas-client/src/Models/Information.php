<?php

declare(strict_types=1);

namespace Blue\HafasClient\Models;

use JsonSerializable;

readonly class Information implements JsonSerializable
{
    public function __construct(
        public string $id,
        public string $head,
        public string $text,
    ) {
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'head' => $this->head,
            'text' => $this->text
        ];
    }
}