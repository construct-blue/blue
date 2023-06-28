<?php

declare(strict_types=1);

include '../../../../vendor/autoload.php';

chdir(dirname(__DIR__));

$http = Blue\Snappy\Core\Http::htmlApp();
$http->initAssets(__DIR__ . '/static/assets-manifest.json');
$http->onGET('index', '/', new Blue\TrainsearchFrontend\Index\IndexHandler());
