<?php

declare(strict_types=1);

namespace Blue\OebbLive;

use Blue\OebbLive\Client\OebbLiveClient;
use Blue\OebbLive\Models\Info;
use Blue\OebbLive\Request\InfoRequest;
use Blue\OebbLive\Response\InfoResponse;
use DateTime;
use GuzzleHttp\Client;

class OebbLive
{
    public function __construct(private OebbLiveClient $client)
    {
    }

    /**
     * @param string $trainNr
     * @param string $stationId
     * @param DateTime $date
     * @return Info
     * @throws Exception\NotFoundException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function info(string $trainNr, string $stationId, DateTime $date): Info
    {
        $request = new InfoRequest($trainNr, $stationId, $date);
        $raw = $this->client->get($request->getEndpoint(), $request->getParams());
        return (new InfoResponse($raw))->parse();
    }

    public function stations(): array
    {
        $raw = $this->client->get('/assets/assets/stations.json', []);
        return array_column($raw, 'name', 'eva');
    }
}