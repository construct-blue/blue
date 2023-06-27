<?php

declare(strict_types=1);

namespace Blue\Example;

use Blue\Snappy\Core\Assets\AssetsLoader;
use Blue\Snappy\Renderer\Renderer;
use Laminas\Diactoros\Response\HtmlResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class IndexHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $assetsLoader = new AssetsLoader(__DIR__ . '/../public/static/assets-manifest.json');
        $renderer = new Renderer();
        return new HtmlResponse(
            $renderer->render(
                include 'app.php',
                $renderer->args(['scripts' => $assetsLoader->getScripts('app')])
            )
        );
    }
}