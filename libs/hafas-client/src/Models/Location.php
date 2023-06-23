<?php

namespace Blue\HafasClient\Models;

/**
 * Coordinates are in the World Geodetic System (WGS84)
 * @package HafasClient\Models
 */
readonly class Location implements \JsonSerializable
{

    public function __construct(public float $latitude, public float $longitude, public ?float $altitude)
    {

    }

    public function jsonSerialize(): mixed
    {
        return [
            'type' => 'location',
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'altitude' => $this->altitude,
        ];
    }

    public function __toString(): string
    {
        return json_encode($this);
    }
}