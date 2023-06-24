<?php

declare(strict_types=1);

namespace Blue\HafasClient\Models;

readonly class Product implements \JsonSerializable
{

    /**
     * @param string $id
     * @param string $mode
     * @param int[] $bitmasks
     * @param string $name
     * @param string $short
     * @param bool $default
     */
    public function __construct(
        public string $id,
        public string $mode,
        public array  $bitmasks,
        public string $name,
        public string $short,
        public bool   $default
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'type' => 'product',
            'id' => $this->id,
            'mode' => $this->mode,
            'bitmasks' => $this->bitmasks,
            'name' => $this->name,
            'short' => $this->short,
            'default' => $this->default
        ];
    }
}
