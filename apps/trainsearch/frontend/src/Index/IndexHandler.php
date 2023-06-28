<?php

declare(strict_types=1);

namespace Blue\TrainsearchFrontend\Index;

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
        $renderer = new Renderer();
        return new HtmlResponse($renderer->render(new IndexView($request->getAttribute(AssetsLoader::class))));
    }
}