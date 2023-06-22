<?php

declare(strict_types=1);

namespace BlueTest\Example;

use Blue\Example\Greeter;
use PHPUnit\Framework\TestCase;

class GreeterTest extends TestCase
{
    public function testGreet()
    {
        self::assertEquals('Hello world!', (new Greeter())->greet('world'));
    }
}
