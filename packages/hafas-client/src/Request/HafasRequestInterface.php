<?php

declare(strict_types=1);

namespace Blue\HafasClient\Request;

use Blue\HafasClient\Profile\Config;

interface HafasRequestInterface
{
    public function toArray(Config $config): array;
}