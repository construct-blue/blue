<?php

declare(strict_types=1);

namespace Blue\TrainsearchFrontend\Component\Layout;

use Blue\Snappy\Renderer\Renderable;
use Blue\Snappy\Renderer\Renderer;

class LayoutView implements Renderable
{
    public function __construct(private $assets, private string $api, private $view)
    {
    }

    public function render(Renderer $renderer, $data = null): iterable
    {
        yield <<<HTML
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, height=device-height, viewport-fit=cover, initial-scale=1.0, maximum-scale = 1.0, user-scalable = no" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="robots" content="noindex, nofollow">
    <title>{$renderer->placeholder('title')}</title>
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#222D59">
    <meta name="theme-color" content="#222D59">
    {$renderer->placeholder('head')}
    {$renderer->render($this->assets)}
</head>
<body data-api="$this->api">
      <main>
            {$renderer->render($this->view)}
      </main>
      <footer>
            <ts-nav></ts-nav>
      </footer>
</body>
</html>
HTML;
    }
}