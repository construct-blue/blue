<?php

namespace Blue\HafasClient\Parser;

use Blue\HafasClient\Exception\InvalidHafasResponse;
use Blue\HafasClient\Models\Trip;
use Blue\HafasClient\Parser\Part\TripParser;
use stdClass;

readonly class JourneyDetailsParser implements HafasResponseParserInterface
{
    public function __construct(private TripParser $parser)
    {
    }

    /**
     * @throws InvalidHafasResponse
     */
    public function parse(stdClass $rawResponse): Trip
    {
        if (!isset($rawResponse->svcResL[0]->res->journey)) {
            throw new InvalidHafasResponse(json_encode($rawResponse));
        }
        $rawJourney = $rawResponse->svcResL[0]->res->journey;
        $rawCommon = $rawResponse->svcResL[0]->res->common;

        return $this->parser->parse($rawCommon, $rawJourney);
    }
}