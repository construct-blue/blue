<?php

declare(strict_types=1);

include '../../../../vendor/autoload.php';

chdir(dirname(__DIR__));

$http = Blue\Snappy\Core\Http::htmlApp();
$http->initAssets();
$http->onGET('ts-number', '/trip', new Blue\TrainsearchFrontend\Page\Trip\TripHandler());
$http->onGET('ts-station', '/departures', new Blue\TrainsearchFrontend\Page\Departures\DeparturesHandler());
$http->onGET('ts-home', '/', new Blue\TrainsearchFrontend\Page\Favorites\FavoritesHandler());
