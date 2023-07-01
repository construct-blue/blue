<?php

declare(strict_types=1);

namespace Blue\TrainsearchFrontend\Page\TrainNumber;

use Blue\Snappy\Core\Assets\AssetsLoader;
use Blue\Snappy\Renderer\Renderer;
use Blue\TrainsearchFrontend\Component\Layout\LayoutView;
use Laminas\Diactoros\Response\HtmlResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class TrainNumberHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $renderer = new Renderer();
        return new HtmlResponse(
            $renderer->render(
                new LayoutView(
                    $request->getAttribute(AssetsLoader::class),
                    '<ts-number></ts-number>'
                )
            )
        );
    }
}