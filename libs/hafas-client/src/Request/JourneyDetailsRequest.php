<?php

declare(strict_types=1);

namespace Blue\HafasClient\Request;

use Blue\HafasClient\Profile\Config;

class JourneyDetailsRequest implements HafasRequestInterface
{

    public function __construct(private string $jid)
    {
    }

    public function toArray(Config $config): array
    {
        $data = [
            'req' => [
                'jid' => $this->jid
            ],
            'meth' => 'JourneyDetails'
        ];
        return $data;
    }
}