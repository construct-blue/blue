<?php

declare(strict_types=1);

namespace BlueTest\HafasClient;

use Carbon\CarbonTimeZone;
use PHPUnit\Framework\TestCase;
use Blue\HafasClient\Helper\Time;
use Blue\HafasClient\Helper\ProductFilter;
use Blue\HafasClient\Exception\ProductNotFoundException;
use Blue\HafasClient\Exception\InvalidFilterException;

final class HelperTest extends TestCase
{

    public function testTimestampParserWithoutOffset(): void
    {
        $timestamp = Time::parseDatetime('20210203', '123456', 120);
        $this->assertEquals(2021, $timestamp->year);
        $this->assertEquals(2, $timestamp->month);
        $this->assertEquals(3, $timestamp->day);
        $this->assertEquals(12, $timestamp->hour);
        $this->assertEquals(34, $timestamp->minute);
        $this->assertEquals(56, $timestamp->second);
        $this->assertEquals(new CarbonTimeZone('+2'), $timestamp->timezone);
    }

    public function testTimestampParserWithOffset(): void
    {
        $timestamp = Time::parseDatetime('20210203', '01020304', 120);
        $this->assertEquals(2021, $timestamp->year);
        $this->assertEquals(2, $timestamp->month);
        $this->assertEquals(4, $timestamp->day);
        $this->assertEquals(2, $timestamp->hour);
        $this->assertEquals(3, $timestamp->minute);
        $this->assertEquals(4, $timestamp->second);
        $this->assertEquals(new CarbonTimeZone('+2'), $timestamp->timezone);
    }

    public function testDateParsing(): void
    {
        $timestamp = Time::parseDate('20210203');
        $this->assertEquals(2021, $timestamp->year);
        $this->assertEquals(2, $timestamp->month);
        $this->assertEquals(3, $timestamp->day);
    }

    public function testProductFilter1(): void
    {
        $bitmask = ProductFilter::createBitmask(['nationalExpress']);
        $this->assertEquals(1, $bitmask);
    }

    public function testProductFilter2(): void
    {
        $bitmask = ProductFilter::createBitmask(['nationalExpress', 'tram', 'taxi']);
        $this->assertEquals(769, $bitmask);
    }

    public function testProductFilter3(): void
    {
        $this->expectException(ProductNotFoundException::class);
        ProductFilter::createBitmask(['somethingRandom']);
    }

    public function testProductFilter4(): void
    {
        $filter = new ProductFilter(
            nationalExpress: true,
            national: false,
            regionalExp: false,
            regional: false,
            suburban: false,
            bus: false,
            ferry: false,
            subway: false,
            tram: true,
            taxi: true
        );
        $this->assertEquals([
            'type' => 'PROD',
            'mode' => 'INC',
            'value' => 769
        ], $filter->filter());
    }

    public function testProductFilter5(): void
    {
        $this->expectException(InvalidFilterException::class);
        $filter = new ProductFilter(
            nationalExpress: false,
            national: false,
            regionalExp: false,
            regional: false,
            suburban: false,
            bus: false,
            ferry: false,
            subway: false,
            tram: false,
            taxi: false
        );
        $filter->filter();
    }
}
