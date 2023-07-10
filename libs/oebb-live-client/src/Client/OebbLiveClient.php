<?php

declare(strict_types=1);

namespace Blue\OebbLive\Client;

use Blue\OebbLive\Exception\NotFoundException;
use Blue\OebbLive\Request\InfoRequest;
use Blue\OebbLive\Response\InfoResponse;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\GuzzleException;
use stdClass;

class OebbLiveClient
{
    private const ENDPOINT = "https://live.oebb.at";

    private const USER_AGENT = 'oebb-live-client';

    /**
     * @param string $endpoint
     * @param array<mixed> $params
     * @return stdClass
     * @throws GuzzleException
     * @throws NotFoundException
     */
    public function get(string $endpoint, array $params): stdClass|array
    {

        $client = new Client();
        try {
            $response = $client->get(self::ENDPOINT . $endpoint . '?' . http_build_query($params), [
                'headers' => [
                    'user-agent' => self::USER_AGENT . uniqid(' ')
                ]
            ]);
        } catch (ClientException $exception) {
            if ($exception->getCode() == 404) {
                throw new NotFoundException('Train composition not found.', 404);
            } else {
                throw $exception;
            }
        }
        $responseBody = $response->getBody()->getContents();
        return json_decode($responseBody);
    }
}