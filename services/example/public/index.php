<?php

declare(strict_types=1);

chdir(dirname(__DIR__));

require '../../../vendor/autoload.php';

$api = Blue\Snappy\Core\Http::htmlApp();
$api->onGET('index', '/', new Blue\TrainsearchApi\TripHandler());

$api->run();