<?php

declare(strict_types=1);

include '../../../../vendor/autoload.php';

chdir(dirname(__DIR__));

$http = Blue\Snappy\Core\Http::htmlApp();
$http->initAssets();
$http->onGET('ts-number', '/train', new Blue\TrainsearchFrontend\Page\TrainNumber\TrainNumberHandler());
$http->onGET('ts-station', '/station', new Blue\TrainsearchFrontend\Page\Station\StationHandler());
$http->onGET('ts-home', '/', new Blue\TrainsearchFrontend\Page\Home\HomeHandler());
