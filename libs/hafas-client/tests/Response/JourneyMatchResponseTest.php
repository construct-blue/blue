<?php

declare(strict_types=1);

namespace BlueTest\HafasClient\Response;

use Blue\HafasClient\Parser\TripParser;
use Blue\HafasClient\Profile\Config;
use Blue\HafasClient\Request\JourneyMatchRequest;
use Blue\HafasClient\Response\JourneyMatchResponse;
use PHPUnit\Framework\TestCase;

class JourneyMatchResponseTest extends TestCase
{
    public function testParse()
    {
        $rawResponse = json_decode(
            file_get_contents(__DIR__ . '/../raw-responses/JourneyMatch.json')
        );
        $response = new JourneyMatchResponse(new TripParser(Config::fromFile(__DIR__ . '/../config/config.json')));
        $journeys = $response->parse($rawResponse);
        self::assertCount(62, $journeys);
        self::assertEquals('1|332602|0|80|3042023', $journeys[0]->id);
        self::assertEquals('Chur', $journeys[0]->stopovers[0]->stop->name);
        self::assertEquals('2023-04-03T12:37:00+02:00', $journeys[0]->stopovers[0]->departure->format(DATE_ATOM));
        self::assertEquals('2023-04-03T14:53:00+02:00', $journeys[0]->stopovers[1]->arrival->format(DATE_ATOM));
        self::assertEquals('Basel SBB', $journeys[0]->stopovers[1]->stop->name);

        self::assertEquals('1|332604|0|80|8012023', $journeys[5]->id);
        self::assertEquals('Basel SBB', $journeys[5]->stopovers[0]->stop->name);
        self::assertEquals('2023-01-08T15:06:00+01:00', $journeys[5]->stopovers[0]->departure->format(DATE_ATOM));
        self::assertEquals('2023-01-08T21:54:00+01:00', $journeys[5]->stopovers[1]->arrival->format(DATE_ATOM));
        self::assertEquals('Hamburg-Altona', $journeys[5]->stopovers[1]->stop->name);
        self::assertEquals('85', $journeys[5]->line->admin);
        self::assertEquals('DB Fernverkehr AG', $journeys[5]->line->operator->name);
    }
}
