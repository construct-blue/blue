<?php

declare(strict_types=1);

namespace BlueTest\HafasClient\Parser;

use Blue\HafasClient\Parser\Part\ProductParser;
use Blue\HafasClient\Profile\Config;
use PHPUnit\Framework\TestCase;

class ProductParserTest extends TestCase
{
    public function testParse()
    {
        $config = Config::fromFile(__DIR__ . '/../config/config.json');
        $parser = new ProductParser($config);
        self::assertEquals('ICE', $parser->parse(1)[0]->short);
        self::assertEquals('S', $parser->parse(16)[0]->short);
        self::assertEquals('ICE', $parser->parse(17)[0]->short);
        self::assertEquals('S', $parser->parse(17)[1]->short);
    }
}
