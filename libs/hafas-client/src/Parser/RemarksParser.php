<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser;

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

            $remarks[] = new Remark(
                type: $rawMessage?->type ?? null,
                code: $rawMessage?->code ?? null,
                prio: $rawMessage?->prio ?? null,
                message: $rawMessage?->txtN ?? null,
            );
        }
        return $remarks;
    }
}