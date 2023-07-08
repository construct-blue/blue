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
    echo json_encode($hafas->getLocation(new Blue\HafasClient\Request\LocMatchRequest($argv[2])), JSON_PRETTY_PRINT);
}



