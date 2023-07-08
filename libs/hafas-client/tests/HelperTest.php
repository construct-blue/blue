<?php

declare(strict_types=1);

namespace BlueTest\HafasClient;

use Carbon\CarbonTimeZone;
use PHPUnit\Framework\TestCase;
use Blue\HafasClient\Helper\Time;

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
}
