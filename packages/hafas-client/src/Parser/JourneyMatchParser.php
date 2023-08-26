<?php

namespace Blue\HafasClient\Parser;

use Blue\HafasClient\Exception\InvalidHafasResponse;
use Blue\HafasClient\Models\Trip;
use Blue\HafasClient\Parser\Part\TripParser;
use stdClass;

readonly class JourneyMatchParser implements HafasResponseParserInterface
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
            throw new InvalidHafasResponse(json_encode($rawResponse));
        }

        $rawCommon = $rawResponse->svcResL[0]->res->common;

        $journeys = [];
        foreach ($rawResponse->svcResL[0]->res->jnyL as $rawJourney) {
            $journeys[] = $this->parser->parse($rawCommon, $rawJourney);
        }
        return $journeys;
    }
}