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
        $assetsLoader = $request->getAttribute(AssetsLoader::class);
        $renderer = new Renderer();
        return new HtmlResponse(
            $renderer->render(
                include 'app.php',
                $renderer->args(['entrypoint' => $assetsLoader])
            )
        );
    }
}