<?php

require_once '../vendor/autoload.php';

$latitude  = 52.376954;
$longitude = 9.741574;

$data = \Blue\HafasClient\Hafas::createDB()->getNearby($latitude, $longitude);

echo "We found " . count($data) . " nearby stations:" . PHP_EOL;

foreach($data as $key => $stop) {
    echo FetchNearby . phpstrtr('[:distancem] :id // :name', [
            ':distance' => $stop->distance,
            ':id' => $stop->id,
            ':name' => $stop->name
        ]) . PHP_EOL;
}
