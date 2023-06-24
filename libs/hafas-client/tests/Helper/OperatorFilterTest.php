<?php

declare(strict_types=1);

namespace BlueTest\HafasClient\Helper;

use Blue\HafasClient\Helper\OperatorFilter;
use Blue\HafasClient\Profile\Config;
use PHPUnit\Framework\TestCase;

class OperatorFilterTest extends TestCase
{
    public function testShouldBuildCommaSeperatedListForHafas()
    {
        $config = Config::fromFile(__DIR__ . '/../config/config.json');

        $filter = new OperatorFilter('dbfern', 'oebb');
        self::assertEquals([
            'type' => 'OP',
            'mode' => 'INC',
            'value'=> 'DB Fernverkehr AG,Österreichische Bundesbahnen'
        ], $filter->filter($config));
    }
}
