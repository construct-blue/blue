<?php

require_once '../vendor/autoload.php';

$query = "Hannover Hbf";
$data  = \Blue\HafasClient\Hafas::createDB()->getLocation($query);

echo '** You\'ve searched for "' . $query . '" **' . PHP_EOL . PHP_EOL;

foreach($data as $stop) {
    echo "** Found " . $stop->name . PHP_EOL;
}
