<?php

namespace Blue\HafasClient;

use Blue\HafasClient\Exception\InvalidProfileException;
use Blue\HafasClient\Models\Stop;
use Blue\HafasClient\Models\Trip;
use Blue\HafasClient\Parser\JourneyDetailsParser;
use Blue\HafasClient\Parser\JourneyMatchParser;
use Blue\HafasClient\Parser\LocMatchParser;
use Blue\HafasClient\Parser\Part\TripParser;
use Blue\HafasClient\Parser\StationBoardParser;
use Blue\HafasClient\Profile\Config;
use Blue\HafasClient\Request\JourneyDetailsRequest;
use Blue\HafasClient\Request\JourneyMatchRequest;
use Blue\HafasClient\Request\LocMatchRequest;
use Blue\HafasClient\Request\StationBoardRequest;
use GuzzleHttp\Exception\GuzzleException;

class Hafas
{
    /**
     * @param Config $config
     * @param Client $client
     */
    public function __construct(private Config $config, private Client $client)
    {
    }

    /**
     * @return Config
     */
    public function getConfig(): Config
    {
        return $this->config;
    }

    /**
     * @throws InvalidProfileException
     */
    public static function create(string $profile): Hafas
    {
        if (!is_dir(__DIR__ . "/../profiles/$profile")) {
            throw new InvalidProfileException('Invalid hafas profile.');
        }
        $config = Config::fromFile(__DIR__ . "/../profiles/$profile/config.json");
        $client = Client::fromFile(__DIR__ . "/../profiles/$profile/request.json");
        return new Hafas($config, $client);
    }

    /**
     * @throws InvalidProfileException
     */
    public static function createDB(): Hafas
    {
        return self::create('db');
    }

    /**
     * @throws InvalidProfileException
     */
    public static function createOeBB(): Hafas
    {
        return self::create('oebb');
    }

    public function getDepartures(string $id): array
    {
        return $this->client->request(
            $this->config,
            new StationBoardRequest('DEP', $id),
            new StationBoardParser(new TripParser($this->config))
        );
    }

    public function getArrivals(string $id): array
    {
        return $this->client->request(
            $this->config,
            new StationBoardRequest('ARR', $id),
            new StationBoardParser(new TripParser($this->config))
        );
    }

    /**
     * @param LocMatchRequest $request
     * @return Stop[]
     * @throws GuzzleException
     */
    public function getLocation(LocMatchRequest $request): array
    {
        return $this->client->request($this->config, $request, new LocMatchParser());
    }

    /**
     * @param JourneyMatchRequest $request
     * @return Trip[]
     * @throws Exception\InvalidHafasResponse
     * @throws GuzzleException|Exception\InvalidFilterException
     */
    public function getTrips(JourneyMatchRequest $request): array
    {
        $trips = $this->client->request($this->config, $request, new JourneyMatchParser(new TripParser($this->config)));
        return array_values($trips);
    }

    /**
     * @param string $id
     * @return Trip
     * @throws Exception\InvalidHafasResponse
     * @throws GuzzleException
     */
    public function getTrip(string $id): Trip
    {
        return $this->client->request(
            $this->config,
            new JourneyDetailsRequest($id),
            new JourneyDetailsParser(new TripParser($this->config))
        );
    }
}