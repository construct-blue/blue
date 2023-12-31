<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser\Part;

use Blue\HafasClient\Models\Remark;

class RemarksParser
{

    /**
     * @param array $msgL
     * @param array $remL
     * @return Remark[]
     */
    public function parse(array $msgL, array $remL): array
    {
        $remarks = [];
        foreach ($msgL as $message) {
            if (!isset($message->remX)) {
                continue;
            }
            $rawMessage = $remL[$message->remX];

            $text = $rawMessage?->txtN ?? '';

            if (str_starts_with($text, '<s>')) {
                continue;
            }

            $remarks[] = new Remark(
                type: $rawMessage?->type ?? null,
                code: $rawMessage?->code ?? null,
                prio: $rawMessage?->prio ?? null,
                message: strip_tags($text),
            );
        }
        return $remarks;
    }
}