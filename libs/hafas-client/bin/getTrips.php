<?php

declare(strict_types=1);

require '../../../vendor/autoload.php';

chdir(dirname(__DIR__));

$hafas = null;
if ($argv[1] === 'oebb') {
    $hafas = Blue\HafasClient\Hafas::createOeBB();
}

if ($argv[1] === 'db') {
    $hafas = Blue\HafasClient\Hafas::createDB();
}

if ($hafas) {
    echo json_encode($hafas->getTrips(new Blue\HafasClient\Request\JourneyMatchRequest($argv[2])), JSON_PRETTY_PRINT);
}


