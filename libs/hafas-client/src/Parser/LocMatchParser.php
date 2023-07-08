<?php

namespace Blue\HafasClient\Parser;

use Blue\HafasClient\Exception\InvalidHafasResponse;
use Blue\HafasClient\Models\Location;
use Blue\HafasClient\Models\Stop;
use stdClass;

class LocMatchParser implements HafasResponseParserInterface
{
    public function parse(stdClass $rawResponse): array
    {
        if (!isset($rawResponse->svcResL[0]->res->match->locL)) {
            throw new InvalidHafasResponse(json_encode($rawResponse));
        }

        $locations = [];

        foreach ($rawResponse->svcResL[0]->res->match->locL as $rawLocation) {
            $location = new Stop(
                id: $rawLocation->extId,
                name: $rawLocation->name,
                location: new Location(
                    latitude: $rawLocation?->crd?->y / 1000000,
                    longitude: $rawLocation?->crd?->x / 1000000,
                    altitude: $rawLocation?->crd?->z ?? null
                )
            );

            $locations[] = $location;
        }

        return $locations;
    }
}