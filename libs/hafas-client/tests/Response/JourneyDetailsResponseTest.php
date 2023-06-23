<?php

declare(strict_types=1);

namespace BlueTest\HafasClient\Response;

use Blue\HafasClient\Parser\TripParser;
use Blue\HafasClient\Profile\Config;
use Blue\HafasClient\Response\JourneyDetailsResponse;
use PHPUnit\Framework\TestCase;

class JourneyDetailsResponseTest extends TestCase
{
    public function testParse()
    {
        $rawResponse = json_decode(file_get_contents(
            __DIR__ . '/../raw-responses/JourneyDetails-ICE28-running-with-delay.json'
        ));
        $response = new JourneyDetailsResponse(new TripParser(Config::fromFile(__DIR__ . '/../config/config.json')));
        $trip = $response->parse($rawResponse);
        self::assertEquals('ICE 28', $trip->line->name);
        self::assertEquals('ICE', $trip->line->product->short);
        self::assertEquals('28', $trip->line->number);
        self::assertEquals('2023-06-18', $trip->date->format('Y-m-d'));
        self::assertEquals('Passau Hbf', $trip->direction);
        self::assertEquals('8A-B', $trip->stopovers[0]->departurePlatform);
        self::assertEquals('09:13:00', $trip->stopovers[0]->departure->format('H:i:s'));
        self::assertNull($trip->stopovers[0]->arrival);
        self::assertEquals('Wien Hbf', $trip->stopovers[0]->stop->name);
        self::assertEquals('Wien Meidling', $trip->stopovers[1]->stop->name);
        self::assertTrue($trip->stopovers[1]->reported);

        self::assertNull($trip->stopovers[16]->delay);
        self::assertEquals('18:46:00', $trip->stopovers[16]->arrival->format('H:i:s'));
        self::assertEquals('18:46:00', $trip->stopovers[16]->plannedArrival->format('H:i:s'));
        self::assertEquals('18:48:00', $trip->stopovers[16]->departure->format('H:i:s'));
        self::assertEquals('18:48:00', $trip->stopovers[16]->plannedDeparture->format('H:i:s'));


        self::assertEquals(1320, $trip->stopovers[17]->delay);
        self::assertEquals(1320, $trip->stopovers[18]->delay);
        self::assertEquals('19:30:00', $trip->stopovers[18]->arrival->format('H:i:s'));
        self::assertEquals('19:09:00', $trip->stopovers[18]->plannedArrival->format('H:i:s'));
        self::assertEquals('19:32:00', $trip->stopovers[18]->departure->format('H:i:s'));
        self::assertEquals('19:10:00', $trip->stopovers[18]->plannedDeparture->format('H:i:s'));
        self::assertTrue($trip->stopovers[3]->reported);
        self::assertTrue($trip->stopovers[5]->reported);
        self::assertTrue($trip->stopovers[16]->reported);
        self::assertTrue($trip->stopovers[18]->reported);
        self::assertFalse($trip->stopovers[19]->reported);
    }
}
