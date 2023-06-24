<?php

require_once '../vendor/autoload.php';

$data = \Blue\HafasClient\Hafas::createDB()->searchTrips('ICE 70');
print_r($data);
