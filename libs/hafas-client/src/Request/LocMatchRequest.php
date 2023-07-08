<?php

declare(strict_types=1);

namespace Blue\HafasClient\Request;

use Blue\HafasClient\Profile\Config;

readonly class LocMatchRequest implements HafasRequestInterface
{
    public function __construct(private string $query, private string $type = 'S')
    {
    }

    public function toArray(Config $config): array
    {
        $data = [
            'req' => [
                'input' => [
                    'field' => 'S',
                    'loc' => [
                        'name' => $this->query,
                        'type' => $this->type
                    ]
                ]
            ],
            'meth' => 'LocMatch'
        ];

        return $data;
    }
}