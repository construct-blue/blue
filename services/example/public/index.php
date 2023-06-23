<?php

declare(strict_types=1);

require '../../../vendor/autoload.php';

chdir(dirname(__DIR__));

$api = Blue\Snappy\Core\Http::htmlApp();
$api->onGET('index', '/', new Blue\TrainsearchApi\TripHandler());

$api->run();