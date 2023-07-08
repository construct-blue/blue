<?php

declare(strict_types=1);

namespace Blue\HafasClient\Helper;

use Blue\HafasClient\Profile\Config;

class OperatorFilter
{
    private array $filter;


    public function __construct(string ...$operator)
    {
        $this->filter = $operator;
    }

    public function filter(Config $config): array
    {
        $operators = $config->getOperators();

        $filter = [];
        foreach ($operators as $operator) {
            if (in_array($operator->id, $this->filter)) {
                $filter[] = $operator->name;
            }
        }

        return [
            'type' => 'OP',
            'mode' => 'INC',
            'value' => implode(',', $filter)
        ];
    }
}