<?php

require_once '../vendor/autoload.php';

$data = \Blue\HafasClient\Hafas::createOeBB()->searchTrips('D 346');
$data = \Blue\HafasClient\Hafas::createOeBB()->trip($data[0]->id);
echo json_encode($data, JSON_PRETTY_PRINT);
