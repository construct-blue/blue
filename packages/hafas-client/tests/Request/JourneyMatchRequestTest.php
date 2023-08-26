<?php

declare(strict_types=1);

namespace BlueTest\HafasClient\Request;

use Blue\HafasClient\Filter\OperatorFilter;
use Blue\HafasClient\Filter\ProductFilter;
use Blue\HafasClient\Helper\Time;
use Blue\HafasClient\Profile\Config;
use Blue\HafasClient\Request\JourneyMatchRequest;
use DateTime;
use PHPUnit\Framework\TestCase;

class JourneyMatchRequestTest extends TestCase
{
    public function testDefaultFilterSimpleSearch()
    {
        $config = Config::fromFile(__DIR__ . '/../config/config.json');

        $request = new JourneyMatchRequest('ICE 70');
        self::assertEquals([
            'cfg' => [
                'polyEnc' => 'GPA',
                'rtMode' => 'REALTIME',
            ],
            'meth' => 'JourneyMatch',
            'req' => [
                'input' => 'ICE 70',
                'extId' => 'ICE 70',
                'tripId' => null,
                'onlyTN' => true,
                'onlyRT' => true,
                'onlyCR' => false,
                'useAeqi' => true,
                'jnyFltrL' => [
                    (new ProductFilter())->filter($config)
                ],
                'date' => Time::formatDate(new DateTime('today 00:00')),
            ],
        ], $request->toArray($config));
    }

    public function testSearchWithTimeRange()
    {
        $config = Config::fromFile(__DIR__ . '/../config/config.json');

        $request = new JourneyMatchRequest('ICE 70');
        self::assertEquals([
            'cfg' => [
                'polyEnc' => 'GPA',
                'rtMode' => 'REALTIME',
            ],
            'meth' => 'JourneyMatch',
            'req' => [
                'input' => 'ICE 70',
                'extId' => 'ICE 70',
                'tripId' => null,
                'onlyTN' => true,
                'onlyRT' => true,
                'onlyCR' => false,
                'useAeqi' => true,
                'jnyFltrL' => [
                    (new ProductFilter())->filter($config)
                ],
                'date' => Time::formatDate(new DateTime('today 00:00')),
            ],
        ], $request->toArray($config));
    }

    public function testSearchWithOperatorFilter()
    {
        $config = Config::fromFile(__DIR__ . '/../config/config.json');

        $request = new JourneyMatchRequest('ICE 70');
        $request->setOperatorFilter(new OperatorFilter('dbfern'));
        self::assertEquals([
            'cfg' => [
                'polyEnc' => 'GPA',
                'rtMode' => 'REALTIME',
            ],
            'meth' => 'JourneyMatch',
            'req' => [
                'input' => 'ICE 70',
                'extId' => 'ICE 70',
                'tripId' => null,
                'onlyTN' => true,
                'onlyRT' => true,
                'onlyCR' => false,
                'useAeqi' => true,
                'jnyFltrL' => [
                    (new ProductFilter())->filter($config),
                    (new OperatorFilter('dbfern'))->filter($config)
                ],
                'date' => Time::formatDate(new DateTime('today 00:00')),
            ],
        ], $request->toArray($config));
    }
}
