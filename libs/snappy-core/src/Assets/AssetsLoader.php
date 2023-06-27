<?php

declare(strict_types=1);

namespace Blue\Snappy\Core\Assets;

use stdClass;

class AssetsLoader
{
    private stdClass $manifest;
    public function __construct(string $manifest)
    {
        $this->manifest = json_decode(file_get_contents($manifest));
    }

    public function getScripts(string $entrypoint): array
    {
        return $this->manifest?->entrypoints?->{$entrypoint}?->assets?->js ?? [];
    }

    public function getStylesheets(string $entrypoint): array
    {
        return $this->manifest?->entrypoints?->{$entrypoint}?->assets?->css ?? [];
    }
}