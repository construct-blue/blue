<?php

declare(strict_types=1);

require '../../../../vendor/autoload.php';

chdir(dirname(__DIR__));

$api = Blue\Snappy\Core\Http::jsonApi();
$api->onGET('trip', '/{profile}/trip/{query}', new Blue\TrainsearchApi\Handler\TripHandler());
$api->onGET('tripsearch', '/{profile}/tripsearch/{query}', new Blue\TrainsearchApi\Handler\TripSearchHandler());
$api->onGET('composition', '/{profile}/composition/{query}', new Blue\TrainsearchApi\Handler\CompositionHandler());
$api->onGET('operators', '/{profile}/operators', new Blue\TrainsearchApi\Handler\OperatorsHandler());
$api->addMiddleware(new Blue\TrainsearchApi\AccessControlHeaderMiddleware());
$api->addMiddleware(new Blue\Snappy\Core\Router\Middleware\ErrorHandlerMiddleware(new Blue\Snappy\Core\ErrorHandler\JsonErrorHandler()));
$api->run();