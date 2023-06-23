<?php

declare(strict_types=1);

chdir(dirname(__DIR__));

require 'vendor/autoload.php';

$hafas = null;
if ($argv[1] === 'oebb') {
    $hafas = \Blue\HafasClient\Hafas::createOeBB();
}

if ($argv[1] === 'db') {
    $hafas = \Blue\HafasClient\Hafas::createDB();
}

if ($hafas) {
    echo json_encode($hafas->tripsByName(new \Blue\HafasClient\Request\JourneyMatchRequest($argv[2], false)), JSON_PRETTY_PRINT);
}


