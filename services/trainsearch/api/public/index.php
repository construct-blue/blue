<?php

declare(strict_types=1);

chdir(dirname(__DIR__));

require '../../../../vendor/autoload.php';

$api = Blue\Snappy\Core\Http::jsonApi();
$api->onGET('trip', '/api/{profile}/trip/{query}', new Blue\TrainsearchApi\TripHandler());
$api->onGET('composition', '/api/oebb/composition/{query}', new Blue\TrainsearchApi\CompositionHandler());

$api->run();