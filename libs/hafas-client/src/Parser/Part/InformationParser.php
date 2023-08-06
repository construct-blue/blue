<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser\Part;

use Blue\HafasClient\Models\Information;

class InformationParser
{

    /**
     * @param array $msgL
     * @param array $himL
     * @return Information[]
     */
    public function parse(array $msgL, array $himL): array
    {
        $infos = [];
        foreach ($msgL as $message) {
            if (!isset($message->himX) || !isset($himL[$message->himX])) {
                continue;
            }

            $rawMessage = $himL[$message->himX];

            if (!isset($rawMessage->act) || !$rawMessage->act) {
                continue;
            }

            $head = $rawMessage?->text ?? '';
            $text = $rawMessage?->head ?? '';

            if (str_starts_with($text, '<s>') || str_starts_with($head, '<s>')) {
                continue;
            }

            $infos[] = new Information(
                head: $head,
                text: $text,
            );
        }
        return $infos;
    }
}