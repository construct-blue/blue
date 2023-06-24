<?php

namespace Blue\HafasClient\Response;

use Blue\HafasClient\Parser\TripParser;
use stdClass;
use Blue\HafasClient\Exception\InvalidHafasResponse;
use Blue\HafasClient\Models\Trip;

class JourneyDetailsResponse
{
    public function __construct(private readonly TripParser $parser)
    {
    }

    /**
     * @throws InvalidHafasResponse
     */
    public function parse(stdClass $rawResponse): Trip
    {
        if (!isset($rawResponse->svcResL[0]->res->journey)) {
            throw new InvalidHafasResponse();
        }
        $rawJourney = $rawResponse->svcResL[0]->res->journey;
        $rawCommon = $rawResponse->svcResL[0]->res->common;

        return $this->parser->parse($rawCommon, $rawJourney);
    }
}