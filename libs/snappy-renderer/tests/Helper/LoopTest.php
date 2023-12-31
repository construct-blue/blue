<?php

namespace BlueTest\Snappy\Renderer\Helper;

use Blue\Snappy\Renderer\Exception\RenderException;
use Blue\Snappy\Renderer\Helper\ArgumentsList;
use Blue\Snappy\Renderer\Helper\Loop;
use Blue\Snappy\Renderer\Renderer;
use PHPUnit\Framework\TestCase;

class LoopTest extends TestCase
{
    /**
     * @throws RenderException
     */
    public function testShouldRenderViewForEachDataItem(): void
    {
        $presidents = [
            [
                'idNumber' => 1,
                'name' => 'Barack Obama',
            ],
            [
                'idNumber' => 2,
                'name' => 'Donald Trump',
            ],
            [
                'idNumber' => 3,
                'name' => 'Joe Biden',
            ],
        ];

        $view = fn(int $idNumber, string $name) => "$idNumber: $name\n";

        $loop = new Loop($view, new ArgumentsList($presidents));

        $result = '';
        /** @noinspection PhpLoopCanBeReplacedWithImplodeInspection */
        foreach ($loop->render(new Renderer()) as $item) {
            $result .= $item;
        }

        self::assertEquals("1: Barack Obama\n2: Donald Trump\n3: Joe Biden\n", $result);
    }
}
