<?php

declare(strict_types=1);

namespace Blue\OebbLive\Client;

use Blue\OebbLive\Request\InfoRequest;
use Blue\OebbLive\Response\InfoResponse;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use stdClass;

class OebbLiveClient
{
    private const ENDPOINT = "https://live.oebb.at/backend";

    private const USER_AGENT = 'oebb-live-client';

    /**
     * @param string $endpoint
     * @param array<mixed> $params
     * @return stdClass
     * @throws GuzzleException
     */
    public function get(string $endpoint, array $params): stdClass
    {
        $client = new Client();
        $response = $client->get(self::ENDPOINT . $endpoint . '?' . http_build_query($params), [
            'headers' => [
                'user-agent' => self::USER_AGENT . uniqid(' ')
            ]
        ]);
        $responseBody = $response->getBody()->getContents();
        return json_decode($responseBody);
    }
}