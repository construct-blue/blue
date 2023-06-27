<?php

declare(strict_types=1);

use Blue\Snappy\Renderer\Renderer;

return fn(array $scripts, Renderer $r) => <<<HTML
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    {$r->loop(fn(string $src) => "<script src='$src'></script>", $scripts)}
</head>
<body>
    <example-app></example-app>
</body>
</html>
HTML;
