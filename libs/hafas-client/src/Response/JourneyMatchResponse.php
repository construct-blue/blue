<?php

namespace Blue\HafasClient\Response;

use Blue\HafasClient\Exception\InvalidHafasResponse;
use Blue\HafasClient\Models\Trip;
use Blue\HafasClient\Parser\TripParser;
use Blue\HafasClient\Request\JourneyMatchRequest;
use stdClass;

class JourneyMatchResponse
{

    public function __construct(private TripParser $parser)
    {
    }

    /**
     * @return Trip[]
     * @throws InvalidHafasResponse
     */
    public function parse(stdClass $rawResponse): array
    {
        if (!isset($rawResponse->svcResL[0]->res->jnyL)) {
            throw new InvalidHafasResponse();
        }

        $rawCommon = $rawResponse->svcResL[0]->res->common;

        $journeys = [];
        foreach ($rawResponse->svcResL[0]->res->jnyL as $rawJourney) {
            $journeys[] = $this->parser->parse($rawCommon, $rawJourney);
        }
        return $journeys;
    }
}