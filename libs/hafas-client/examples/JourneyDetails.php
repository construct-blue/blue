<?php

require_once '../vendor/autoload.php';

$data = \Blue\HafasClient\Hafas::createDB()->searchTrips('ICE 28', new DateTime('today 00:00'), new DateTime('today 23:00'));
$data = \Blue\HafasClient\Hafas::createDB()->trip($data[0]->id);
echo json_encode($data, JSON_PRETTY_PRINT);
