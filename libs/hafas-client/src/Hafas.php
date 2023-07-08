<?php

namespace Blue\HafasClient;

use Blue\HafasClient\Exception\InvalidProfileException;
use Carbon\Carbon;
use DateTime;
use GuzzleHttp\Exception\GuzzleException;
use Blue\HafasClient\Helper\OperatorFilter;
use Blue\HafasClient\Parser\TripParser;
use Blue\HafasClient\Profile\Config;
use Blue\HafasClient\Request\JourneyMatchRequest;
use Blue\HafasClient\Response\JourneyMatchResponse;
use Blue\HafasClient\Response\StationBoardResponse;
use Blue\HafasClient\Response\LocMatchResponse;
use Blue\HafasClient\Response\JourneyDetailsResponse;
use Blue\HafasClient\Models\Trip;
use Blue\HafasClient\Response\LocGeoPosResponse;
use Blue\HafasClient\Helper\ProductFilter;

class Hafas
{
    private Request $request;
    private Config $config;

    public const PROFILES = [
        'db',
        'oebb'
    ];

    /**
     * @param Config $config
     * @param Request $request
     */
    public function __construct(Config $config, Request $request)
    {
        $this->config = $config;
        $this->request = $request;
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
        if (!in_array($profile, self::PROFILES)) {
            throw new InvalidProfileException('Invalid hafas profile.');
        }
        $config = Config::fromFile(__DIR__ . "/../profiles/$profile/config.json");
        $request = Request::fromFile(__DIR__ . "/../profiles/$profile/request.json");
        return new Hafas($config, $request);
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


    /**
     * @throws GuzzleException|Exception\InvalidHafasResponse
     * @throws Exception\ProductNotFoundException|Exception\InvalidFilterException
     * @todo parse stopovers
     * @todo set language in request
     * @todo support remarks, hints, warnings
     * @todo filter by direction
     */
    public function getDepartures(
        int $lid,
        Carbon $timestamp,
        int $maxJourneys = 5,
        int $duration = -1,
        ProductFilter $filter = null,
    ): ?array {
        if ($filter === null) {
            //true is default for all
            $filter = new ProductFilter();
        }

        $data = [
            'req' => [
                'type' => 'DEP',
                'stbLoc' => [
                    'lid' => 'A=1@L=' . $lid . '@',
                ],
                'dirLoc' => null,
                //[ //direction, not required
                //                'lid' => '',
                //],
                'maxJny' => $maxJourneys,
                'date' => $timestamp->format('Ymd'),
                'time' => $timestamp->format('His'),
                'dur' => $duration,
                'jnyFltrL' => [$filter->filter($this->config)]
            ],
            'meth' => 'StationBoard'
        ];

        return (new StationBoardResponse($this->request->request($this->config, $data)))->parse();
    }

    /**
     * @param int $lid
     * @param Carbon $timestamp
     * @param int $maxJourneys
     * @param int $duration
     * @param ProductFilter|null $filter
     *
     * @return array|null
     * @throws Exception\InvalidFilterException
     * @throws Exception\InvalidHafasResponse
     * @throws Exception\ProductNotFoundException
     * @throws GuzzleException
     * @todo parse stopovers
     * @todo set language in request
     * @todo support remarks, hints, warnings
     * @todo filter by direction
     */
    public function getArrivals(
        int $lid,
        Carbon $timestamp,
        int $maxJourneys = 5,
        int $duration = -1,
        ProductFilter $filter = null,
    ): ?array {
        if ($filter === null) {
            //true is default for all
            $filter = new ProductFilter();
        }

        $data = [
            'req' => [
                'type' => 'ARR',
                'stbLoc' => [
                    'lid' => 'A=1@L=' . $lid . '@',
                ],
                'dirLoc' => null,
                //[ //direction, not required
                //                'lid' => '',
                //],
                'maxJny' => $maxJourneys,
                'date' => $timestamp->format('Ymd'),
                'time' => $timestamp->format('His'),
                'dur' => $duration,
                'jnyFltrL' => [$filter->filter($this->config)]
            ],
            'meth' => 'StationBoard'
        ];

        return (new StationBoardResponse($this->request->request($this->config, $data)))->parse();
    }

    /**
     * @param string $query
     * @param string $type 'S' = stations, 'ALL' stations and addresses
     *
     * @return array|null
     * @throws Exception\InvalidHafasResponse
     * @throws GuzzleException
     */
    public function getLocation(
        string $query,
        string $type = 'S'
    ): ?array {
        $data = [
            'req' => [
                'input' => [
                    'field' => 'S',
                    'loc' => [
                        'name' => $query,
                        'type' => $type
                    ]
                ]
            ],
            'meth' => 'LocMatch'
        ];

        return (new LocMatchResponse($this->request->request($this->config, $data)))->parse();
    }

    /**
     * @throws GuzzleException
     * @throws Exception\InvalidHafasResponse
     */
    public function getJourney(string $journeyId): ?Trip
    {
        $data = [
            'req' => [
                'jid' => $journeyId
            ],
            'meth' => 'JourneyDetails'
        ];
        return (new JourneyDetailsResponse(new TripParser($this->config)))->parse(
            $this->request->request($this->config, $data)
        );
    }

    /**
     * @throws GuzzleException
     * @throws Exception\InvalidHafasResponse
     */
    public function getNearby(float $latitude, float $longitude, $limit = 8): array
    {
        $data = [
            'req' => [
                "ring" => [
                    "cCrd" => [
                        "x" => $longitude * 1000000,
                        "y" => $latitude * 1000000
                    ],
                    "maxDist" => -1,
                    "minDist" => 0
                ],
                "locFltrL" => [
                    [
                        "type" => "PROD",
                        "mode" => "INC",
                        "value" => "1023"
                    ]
                ],
                "getPOIs" => false,
                "getStops" => true,
                "maxLoc" => $limit
            ],
            'cfg' => [
                'polyEnc' => 'GPA',
                'rtMode' => 'HYBRID',
            ],
            'meth' => 'LocGeoPos'
        ];

        return (new LocGeoPosResponse($this->request->request($this->config, $data)))->parse();
    }

    /**
     * @param JourneyMatchRequest $request
     * @return Trip[]
     * @throws Exception\InvalidHafasResponse
     * @throws GuzzleException
     */
    public function tripsByName(JourneyMatchRequest $request): array
    {
        $trips = (new JourneyMatchResponse(new TripParser($this->config)))->parse(
            $this->request->request($this->config, $request->toArray($this->config))
        );

        return array_values($trips);
    }

    public function trip(string $id): Trip
    {
        $data = [
            'req' => [
                'jid' => $id
            ],
            'meth' => 'JourneyDetails'
        ];
        return (new JourneyDetailsResponse(new TripParser($this->config)))->parse(
            $this->request->request($this->config, $data)
        );
    }

    /**
     * @param string $query
     * @param DateTime|null $fromWhen
     * @param DateTime|null $untilWhen
     * @param ProductFilter|null $productFilter
     * @param OperatorFilter|null $operatorFilter
     * @return Trip[]
     * @throws Exception\InvalidHafasResponse
     * @throws GuzzleException
     */
    public function searchTrips(
        string $query,
        ProductFilter $productFilter = null,
        OperatorFilter $operatorFilter = null
    ): array {
        $journeyMatchRequest = new JourneyMatchRequest($query);

        if ($productFilter) {
            $journeyMatchRequest->setProductFilter($productFilter);
        }

        if ($operatorFilter) {
            $journeyMatchRequest->setOperatorFilter($operatorFilter);
        }

        return $this->tripsByName($journeyMatchRequest);
    }
}