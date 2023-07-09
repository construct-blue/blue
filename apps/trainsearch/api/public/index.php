<?php

declare(strict_types=1);

require '../../../../vendor/autoload.php';

chdir(dirname(__DIR__));

$api = Blue\Snappy\Core\Http::jsonApi();
$api->onGET('trip', '/{profile}/trip/{query}', new Blue\TrainsearchApi\Handler\TripHandler());
$api->onGET('tripdetails', '/{profile}/tripdetails/{query}', new Blue\TrainsearchApi\Handler\TripDetailsHandler());
$api->onGET('tripsearch', '/{profile}/tripsearch/{query}', new Blue\TrainsearchApi\Handler\TripSearchHandler());
$api->onGET('location', '/{profile}/location/{query}', new Blue\TrainsearchApi\Handler\LocationHandler());
$api->onGET('departures', '/{profile}/departures/{query}', new Blue\TrainsearchApi\Handler\DeparturesHandler());
$api->onGET('arrivals', '/{profile}/arrivals/{query}', new Blue\TrainsearchApi\Handler\ArrivalsHandler());
$api->onGET('composition', '/{profile}/composition/{query}', new Blue\TrainsearchApi\Handler\CompositionHandler());
$api->onGET('operators', '/{profile}/operators', new Blue\TrainsearchApi\Handler\OperatorsHandler());
$api->onGET('uicprefixes', '/{profile}/uicprefixes', new Blue\TrainsearchApi\Handler\UICPrefixHandler());
$api->addMiddleware(new Blue\TrainsearchApi\AccessControlHeaderMiddleware());
$api->addMiddleware(new Blue\Snappy\Core\Router\Middleware\ErrorHandlerMiddleware(new Blue\Snappy\Core\ErrorHandler\JsonErrorHandler()));
$api->run();