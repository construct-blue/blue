<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser\Part;

class StopNameParser
{
    private const REMOVED_SUFFIXES = [
        'Bahnhof',
        'Bahnhst'
    ];

    public function parse(string $stopName): string
    {
        foreach (self::REMOVED_SUFFIXES as $suffix) {
            if (str_ends_with($stopName, $suffix)) {
                $stopName = trim(substr($stopName, 0, strlen($stopName) - strlen($suffix)));
            }
        }
        return $stopName;
    }
}