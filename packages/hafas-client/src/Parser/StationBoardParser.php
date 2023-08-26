<?php

namespace Blue\HafasClient\Parser;

use Blue\HafasClient\Parser\Part\TripParser;
use stdClass;

class StationBoardParser implements HafasResponseParserInterface
{
    public function __construct(private TripParser $parser)
    {
    }

    public function parse(stdClass $rawResponse): array
    {
        return (new JourneyMatchParser($this->parser))->parse($rawResponse);
    }
}