<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser\Part;

use Blue\HafasClient\Helper\Time;
use Blue\HafasClient\Models\Location;
use Blue\HafasClient\Models\Stop;
use Blue\HafasClient\Models\Stopover;
use stdClass;

class StopoverParser
{
    public function __construct(private LineParser $lineParser, private RemarksParser $remarksParser)
    {
    }


    public function parse(
        stdClass $rawCommon,
        stdClass $rawStop,
        stdClass $rawJourney,
        int $index,
        float $defaultTZOffset
    ): Stopover {
        $rawLoc = $rawCommon->locL[$rawStop->locX];
        $plannedArrival = isset($rawStop->aTimeS) ? Time::parseDatetime(
            $rawJourney->date,
            $rawStop->aTimeS,
            (float)($rawStop->aTZOffset ?? $defaultTZOffset)
        ) : null;
        $arrival = isset($rawStop->aTimeR) ? Time::parseDatetime(
            $rawJourney->date,
            $rawStop->aTimeR,
            (float)($rawStop->aTZOffset ?? $defaultTZOffset)
        ) : $plannedArrival;
        $plannedDeparture = isset($rawStop->dTimeS) ? Time::parseDatetime(
            $rawJourney->date,
            $rawStop->dTimeS,
            (float)($rawStop->dTZOffset ?? $defaultTZOffset)
        ) : null;
        $departure = isset($rawStop->dTimeR) ? Time::parseDatetime(
            $rawJourney->date,
            $rawStop->dTimeR,
            (float)($rawStop->dTZOffset ?? $defaultTZOffset)
        ) : $plannedDeparture;

        $departureDelay = null;
        if ($departure && $plannedDeparture && $plannedDeparture < $departure) {
            $departureDelay = $departure->diffInSeconds($plannedDeparture);
        }
        $arrivalDelay = null;
        if ($arrival && $plannedArrival && $plannedArrival < $arrival) {
            $arrivalDelay = $arrival->diffInSeconds($plannedArrival);
        }

        $arrivalPlatformPlanned = $rawStop?->aPlatfS ?? $rawStop?->aPltfS?->txt ?? null;
        $arrivalPlatform = $rawStop?->aPlatfR ?? $rawStop?->aPltfR?->txt ?? $arrivalPlatformPlanned;
        $departurePlatformPlanned = $rawStop?->dPlatfS ?? $rawStop?->dPltfS?->txt ?? null;
        $departurePlatform = $rawStop?->dPlatfR ?? $rawStop?->dPltfR?->txt ?? $departurePlatformPlanned;
        $remarks = $this->remarksParser->parse($rawStop->msgL ?? [], $rawCommon->remL ?? []);


        $requestStop = null;
        if (isset($rawCommon->remL)) {
            foreach ($rawCommon->remL as $rawRemark) {
                if (($rawRemark->code ?? '') == 'BH') {
                    if (str_contains($rawRemark->txtN ?? '', $rawLoc?->name ?? '')) {
                        $requestStop = true;
                        break;
                    } else {
                        $requestStop = false;
                    }
                }
            }
        }

        $changedLine = null;
        if (isset($rawStop->dProdX) && isset($rawStop->aProdX) && $rawStop->dProdX != $rawStop->aProdX) {
            if (isset($rawCommon->prodL[$rawStop->dProdX])) {
                $dProd = $rawCommon->prodL[$rawStop->dProdX];
                $changedLine = $this->lineParser->parse($dProd, $rawJourney, $rawCommon);
            }
        }

        return new Stopover(
            stop: new Stop(
                id: $rawLoc?->extId ?? '',
                name: $rawLoc?->name ?? '',
                location: new Location(
                    latitude: $rawLoc?->crd?->y / 1000000,
                    longitude: $rawLoc?->crd?->x / 1000000,
                    altitude: $rawLoc?->crd?->z ?? null
                )
            ),
            index: $rawStop?->idx ?? $index,
            plannedArrival: $plannedArrival,
            arrival: $arrival,
            arrivalPlatform: $arrivalPlatform,
            plannedDeparture: $plannedDeparture,
            departure: $departure,
            departurePlatform: $departurePlatform,
            requestStop: $requestStop,
            isCancelled: isset($rawStop?->aCncl) || isset($rawStop?->dCnl),
            delay: $departureDelay ?? $arrivalDelay,
            arrivalDelay: $arrivalDelay,
            departureDelay: $departureDelay,
            reported: ($rawStop?->dProgType ?? null) === 'REPORTED',
            progType: $rawStop?->dProgType ?? null,
            border: $rawStop?->border ?? null,
            changedLine: $changedLine,
            remarks: $remarks
        );
    }
}