<?php

declare(strict_types=1);

namespace Blue\HafasClient\Models;

use JsonSerializable;

readonly class Information implements JsonSerializable
{
    public function __construct(
        public string $head,
        public string $text,
    ) {
    }

    public function jsonSerialize(): array
    {
        return [
            'head' => $this->head,
            'text' => $this->text
        ];
    }
}