<?php

declare(strict_types=1);

namespace Blue\Snappy\Core\Assets;

class Assets
{
    /**
     * @param Script[] $js
     */
    public function __construct(private array $js)
    {
    }

    /**
     * @return Script[]
     */
    public function getJs(): array
    {
        return $this->js;
    }
}