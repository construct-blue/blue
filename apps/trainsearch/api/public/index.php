<?php

declare(strict_types=1);

require '../../../../vendor/autoload.php';

chdir(dirname(__DIR__));

$api = Blue\Snappy\Core\Http::jsonApi();
$api->onGET('trip', '/{cache}/{profile}/trip/{query}', new Blue\TrainsearchApi\Handler\TripHandler());
$api->onGET('tripdetails', '/{cache}/{profile}/tripdetails/{query}', new Blue\TrainsearchApi\Handler\TripDetailsHandler());
$api->onGET('tripsearch', '/{cache}/{profile}/tripsearch/{query}', new Blue\TrainsearchApi\Handler\TripSearchHandler());
$api->onGET('location', '/{cache}/{profile}/location/{query}', new Blue\TrainsearchApi\Handler\LocationHandler());
$api->onGET('departures', '/{cache}/{profile}/departures/{query}', new Blue\TrainsearchApi\Handler\DeparturesHandler());
$api->onGET('arrivals', '/{cache}/{profile}/arrivals/{query}', new Blue\TrainsearchApi\Handler\ArrivalsHandler());
$api->onGET('composition-stations', '/{cache}/{profile}/composition/stations', new Blue\TrainsearchApi\Handler\CompositionStationsHandler());
$api->onGET('composition', '/{cache}/{profile}/composition/{query}', new Blue\TrainsearchApi\Handler\CompositionHandler());
$api->onGET('operators', '/{cache}/{profile}/operators', new Blue\TrainsearchApi\Handler\OperatorsHandler());
$api->onGET('uicprefixes', '/{cache}/{profile}/uicprefixes', new Blue\TrainsearchApi\Handler\UICPrefixHandler());
$api->addMiddleware(new Blue\TrainsearchApi\AccessControlHeaderMiddleware());
$api->addMiddleware(new Blue\Snappy\Core\Router\Middleware\ErrorHandlerMiddleware(new Blue\Snappy\Core\ErrorHandler\JsonErrorHandler()));
$api->run();