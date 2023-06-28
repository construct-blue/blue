<?php

declare(strict_types=1);

namespace Blue\TrainsearchFrontend\Index;

use Blue\Snappy\Renderer\Renderable;
use Blue\Snappy\Renderer\Renderer;

class IndexView implements Renderable
{
    public function __construct(private $assets)
    {
    }

    public function render(Renderer $renderer, $data = null): iterable
    {
        yield <<<HTML
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>TrainSearch</title>
    {$renderer->render($this->assets)}
</head>
<body>
  <index-element></index-element>
</body>
</html>
HTML;
    }
}