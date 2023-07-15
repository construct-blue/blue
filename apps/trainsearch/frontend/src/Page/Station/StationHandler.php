<?php

declare(strict_types=1);

namespace Blue\TrainsearchFrontend\Page\Station;

use Blue\Snappy\Core\Assets\AssetsLoader;
use Blue\Snappy\Renderer\Renderer;
use Blue\TrainsearchFrontend\Component\Layout\LayoutView;
use Laminas\Diactoros\Response\HtmlResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class StationHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        if (str_ends_with($request->getUri()->getHost(), '.local')) {
            $api = 'https://trainsearch-api.local';
        } else {
            $api = 'https://trainsearch-api.snappy.blue';
        }

        $renderer = new Renderer();
        return new HtmlResponse(
            $renderer->render(
                new LayoutView(
                    $request->getAttribute(AssetsLoader::class),
                    $api,
                    '<ts-station></ts-station>'
                )
            )
        );
    }
}