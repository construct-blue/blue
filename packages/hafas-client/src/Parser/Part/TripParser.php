<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser\Part;

use Blue\HafasClient\Helper\Time;
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
        $informationParser = new InformationParser();
        $productParser = new ProductParser($this->config);
        $operatorParser = new OperatorParser($this->config);
        $lineParser = new LineParser($productParser, $operatorParser);
        $stopoverParser = new StopoverParser($lineParser, $remarksParser, $informationParser);
        $defaultTZOffset = $this->config->getDefaultTZOffset();
        $rawLine = $rawCommon->prodL[$rawJourney->prodX];

        $stopovers = [];
        if (isset($rawJourney->stopL)) {
            foreach ($rawJourney->stopL as $index => $rawStop) {
                $stopovers[] = $stopoverParser->parse($rawCommon, $rawStop, $rawJourney, $index, $defaultTZOffset);
            }
        } elseif (isset($rawJourney->stbStop)) {
            $stopovers[] = $stopoverParser->parse($rawCommon, $rawJourney->stbStop, $rawJourney, 0, $defaultTZOffset);
        }


        $foreign = true;
        foreach ($stopovers as $stopover) {
            if (str_starts_with($stopover->stop->id, $this->config->getNationalUICPrefix())) {
                $foreign = false;
                break;
            }
        }

        $remarks = $remarksParser->parse($rawJourney->msgL ?? [], $rawCommon->remL ?? []);
        $infos = $informationParser->parse($rawJourney->msgL ?? [], $rawCommon->himL ?? []);
        $line = $lineParser->parse($rawLine, $rawJourney, $rawCommon);

        $direction = null;
        if (isset($rawJourney->dirTxt)) {
            $direction = (new StopNameParser())->parse($rawJourney->dirTxt);
        }

        return new Trip(
            id: $rawJourney?->jid ?? '',
            direction: $direction,
            date: Time::parseDate($rawJourney->date),
            line: $line,
            stopovers: $stopovers,
            remarks: $remarks,
            infos: $infos,
            origin: $stopovers[0] ?? null,
            foreign: $foreign
        );
    }
}