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

    public function admins(Config $config): array
    {
        $operators = $config->getOperators();

        $admins = [];
        foreach ($operators as $operator) {
            if (isset($operator->admin) && in_array($operator->id, $this->filter)) {
                $admins[] = $operator->admin;
            }
        }
        return $admins;
    }

    public function filter(Config $config): array
    {
        $operators = $config->getOperators();

        $filter = [];
        foreach ($operators as $operator) {
            if (!isset($operator->admin) && in_array($operator->id, $this->filter)) {
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