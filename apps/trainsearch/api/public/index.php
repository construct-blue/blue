<?php

declare(strict_types=1);

require '../../../../vendor/autoload.php';

chdir(dirname(__DIR__));

$api = Blue\Snappy\Core\Http::jsonApi();
$api->onGET('trip', '/{profile}/trip/{query}', new Blue\TrainsearchApi\Handler\TripHandler());
$api->onGET('composition', '/oebb/composition/{query}', new Blue\TrainsearchApi\Handler\CompositionHandler());
$api->onGET('operators', '/{profile}/operators', new Blue\TrainsearchApi\Handler\OperatorsHandler());
$api->addMiddleware(new Blue\TrainsearchApi\AccessControlHeaderMiddleware());
$api->run();