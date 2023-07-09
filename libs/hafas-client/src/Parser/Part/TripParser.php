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
        $lineParser = new LineParser($productParser, $operatorParser);
        $stopoverParser = new StopoverParser($lineParser, $remarksParser);
        $defaultTZOffset = $this->config->getDefaultTZOffset();
        $rawLine = $rawCommon->prodL[$rawJourney->prodX];

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

        $line = $lineParser->parse($rawLine, $rawCommon);
        return new Trip(
            id: $rawJourney?->jid ?? '',
            direction: $rawJourney?->dirTxt ?? null,
            date: Time::parseDate($rawJourney->date),
            line: $line,
            stopovers: $stopovers,
            remarks: $remarks
        );
    }
}