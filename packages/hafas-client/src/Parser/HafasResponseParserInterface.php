<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser;

use stdClass;

interface HafasResponseParserInterface
{
    public function parse(stdClass $rawResponse);
}