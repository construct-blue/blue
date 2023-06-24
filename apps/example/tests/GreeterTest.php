<?php

declare(strict_types=1);

namespace BlueTest\Example;

use Blue\Example\Greeter;
use PHPUnit\Framework\TestCase;

class GreeterTest extends TestCase
{
    /**
     * @covers \Blue\Example\Greeter::greet
     * @return void
     */
    public function testGreet()
    {
        self::assertEquals('Hello world!', (new Greeter())->greet('world'));
    }
}
