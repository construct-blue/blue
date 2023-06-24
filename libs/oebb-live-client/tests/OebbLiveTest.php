<?php

declare(strict_types=1);

namespace BlueTest\OebbLive;

use Blue\OebbLive\Client\OebbLiveClient;
use Blue\OebbLive\OebbLive;
use DateTime;
use PHPUnit\Framework\TestCase;

class OebbLiveTest extends TestCase
{

    public function testInfo(): void
    {
        $client = $this->createMock(OebbLiveClient::class);
        $client->method('get')->willReturn(json_decode(file_get_contents(__DIR__ . '/RJ78-8100173.json')));
        $live = new OebbLive($client);
        $info = $live->info('78', '8100173', new DateTime('2023-06-22'));
        self::assertCount(8, $info->vehicles);
    }
}
