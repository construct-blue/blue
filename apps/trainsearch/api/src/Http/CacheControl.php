<?php

declare(strict_types=1);

namespace Blue\TrainsearchApi\Http;

class CacheControl
{
    public static function getHeaderValue(int $seconds): string
    {
        return "public, max-age=$seconds, s-maxage=$seconds, stale-while-revalidate=10";
    }
}