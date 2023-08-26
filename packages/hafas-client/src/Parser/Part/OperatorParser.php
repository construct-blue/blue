<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser\Part;

use Blue\HafasClient\Models\Operator;
use Blue\HafasClient\Profile\Config;
use stdClass;

class OperatorParser
{
    private array $operators = [];

    public function __construct(private Config $config)
    {
        foreach ($this->config->getOperators() as $operator) {
            $this->operators[$operator->name] = $operator;
        }
    }

    public function parse(stdClass $rawLineOperator): ?Operator
    {
        if (isset($rawLineOperator->name)) {
            return $this->operators[$rawLineOperator->name] ?? new Operator('', $rawLineOperator->name);
        }
        return null;
    }
}