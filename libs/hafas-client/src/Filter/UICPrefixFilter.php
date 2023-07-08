<?php

declare(strict_types=1);

namespace Blue\HafasClient\Filter;

class UICPrefixFilter
{
    private array $filter;

    public function __construct(int ...$filter)
    {
        $this->filter = $filter;
    }

    public function filter(): array
    {
        return [
            'type' => 'UIC',
            'mode' => 'INC',
            'value' => implode(',', $this->filter)
        ];
    }
}