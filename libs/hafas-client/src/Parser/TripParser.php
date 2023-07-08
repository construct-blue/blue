<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser;

use Blue\HafasClient\Helper\Time;
use Blue\HafasClient\Models\Product;
use Blue\HafasClient\Models\Trip;
use Blue\HafasClient\Models\Line;
use Blue\HafasClient\Models\Location;
use Blue\HafasClient\Models\Operator;
use Blue\HafasClient\Models\Remark;
use Blue\HafasClient\Models\Stop;
use Blue\HafasClient\Models\Stopover;
use Blue\HafasClient\Profile\Config;
use stdClass;

class TripParser
{
    public function __construct(private Config $config)
    {
    }

    public function parse(stdClass $rawCommon, stdClass $rawJourney): Trip
    {
        $remarksParser = new RemarksParser();
        $productParser = new ProductParser($this->config);
        $operatorParser = new OperatorParser($this->config);

        $defaultTZOffset = $this->config->getDefaultTZOffset();
        $rawLine = $rawCommon->prodL[$rawJourney->prodX];
        $rawLineOperator = $rawCommon->opL[$rawLine->oprX ?? 0] ?? null;

        $stopovers = [];
        foreach ($rawJourney->stopL as $index => $rawStop) {
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
            $remarks = $remarksParser->parse($rawStop->msgL ?? [], $rawCommon->remL ?? []);

            $stopovers[] = new Stopover(
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
                isCancelled: isset($rawStop?->aCncl) || isset($rawStop?->dCnl),
                delay: $departureDelay ?? $arrivalDelay,
                arrivalDelay: $arrivalDelay,
                departureDelay: $departureDelay,
                reported: ($rawStop?->dProgType ?? null) === 'REPORTED',
                progType: $rawStop?->dProgType ?? null,
                border: $rawStop?->border ?? null,
                remarks: $remarks
            );
        }

        $remarks = $remarksParser->parse($rawJourney->msgL ?? [], $rawCommon->remL ?? []);

        $admin = null;
        if (isset($rawLine?->prodCtx?->admin) && $rawLine?->prodCtx?->admin) {
            $admin = trim((string)$rawLine?->prodCtx?->admin, '_');
        }

        $product = $productParser->parse((int)$rawLine->cls ?? 0)[0] ?? null;

        return new Trip(
            id: $rawJourney?->jid ?? '',
            direction: $rawJourney?->dirTxt ?? null,
            date: Time::parseDate($rawJourney->date),
            line: new Line(
                id: $rawLine?->prodCtx?->num ?? $rawLine?->prodCtx?->lineId ?? $rawLine?->prodCtx?->matchId ?? '',
                name: $rawLine?->name ?? null,
                category: isset($rawLine?->prodCtx?->catOut) ? trim($rawLine->prodCtx->catOut) : null,
                number: $rawLine?->number ?? null,
                mode: $product?->mode,
                product: $product,
                operator: $operatorParser->parse($rawLineOperator),
                admin: $admin,
            ),
            stopovers: $stopovers,
            remarks: $remarks,
        );
    }
}