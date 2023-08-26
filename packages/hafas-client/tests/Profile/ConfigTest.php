<?php

declare(strict_types=1);

namespace BlueTest\HafasClient\Profile;

use Blue\HafasClient\Profile\Config;
use PHPUnit\Framework\TestCase;

class ConfigTest extends TestCase
{
    public function testFromFile()
    {
        $config = Config::fromFile(__DIR__ . '/../config/config.json');
        self::assertEquals('hafas-client-php', $config->getUserAgent());
        self::assertEquals('https://reiseauskunft.bahn.de/bin/mgate.exe', $config->getEndpoint());
        self::assertEquals('6264493855566A34304B356676787766', $config->getSalt());
        self::assertEquals('de', $config->getDefaultLanguage());
        self::assertEquals(false, $config->isAddMicMac());
        self::assertEquals(true, $config->isAddChecksum());
        self::assertEquals(120, $config->getDefaultTZOffset());
        $products = $config->getProducts();
        self::assertCount(10, $products);
        self::assertEquals('nationalExpress', $products[0]->id);
        self::assertEquals('InterCityExpress', $products[0]->name);
        self::assertEquals([1], $products[0]->bitmasks);
        self::assertEquals('ICE', $products[0]->short);
        self::assertEquals(true, $products[0]->default);
        $operators = $config->getOperators();
        self::assertCount(3, $operators);
        self::assertEquals('dbfern', $operators[0]->id);
    }
}
