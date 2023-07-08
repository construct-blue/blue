<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser\Part;

use Blue\HafasClient\Helper\Time;
use Blue\HafasClient\Models\Line;
use Blue\HafasClient\Models\Location;
use Blue\HafasClient\Models\Stop;
use Blue\HafasClient\Models\Stopover;
use Blue\HafasClient\Models\Trip;
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
        $stopoverParser = new StopoverParser();

        $defaultTZOffset = $this->config->getDefaultTZOffset();
        $rawLine = $rawCommon->prodL[$rawJourney->prodX];
        $rawLineOperator = $rawCommon->opL[$rawLine->oprX ?? 0] ?? null;

        $stopovers = [];
        if (isset($rawJourney->stopL)) {
            // stbStop
            foreach ($rawJourney->stopL as $index => $rawStop) {
                $stopovers[] = $stopoverParser->parse($rawCommon, $rawStop, $rawJourney, $index, $defaultTZOffset);
            }
        } elseif (isset($rawJourney->stbStop)) {
            $stopovers[] = $stopoverParser->parse($rawCommon, $rawJourney->stbStop, $rawJourney, 0, $defaultTZOffset);
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