<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser\Part;

use Blue\HafasClient\Models\Line;
use stdClass;

class LineParser
{
    public function __construct(private ProductParser $productParser, private OperatorParser $operatorParser)
    {
    }

    public function parse(stdClass $rawLine, stdClass $rawJourney, stdClass $rawCommon): Line
    {
        $admin = null;
        if (isset($rawLine?->prodCtx?->admin) && $rawLine?->prodCtx?->admin) {
            $admin = trim((string)$rawLine?->prodCtx?->admin, '_');
        }

        $trainName = null;
        if (
            isset($rawCommon->remL) && is_array($rawCommon->remL)
            && isset($rawJourney->msgL) && is_array($rawJourney->msgL)
        ) {
            foreach ($rawJourney->msgL as $message) {
                if (!isset($message->remX)) {
                    continue;
                }
                $rawRemark = $rawCommon->remL[$message->remX];

                $code = $rawRemark->code ?? null;
                $type = $rawRemark->type ?? null;
                if ($code === 'ZN' && $type === 'I' && isset($rawRemark->txtN)) {
                    $trainName = $rawRemark->txtN;
                    break;
                }
            }
        }

        $product = $this->productParser->parse((int)$rawLine->cls ?? 0)[0] ?? null;

        $rawLineOperator = $rawCommon->opL[$rawLine->oprX ?? 0] ?? null;
        return new Line(
            id: $rawLine?->prodCtx?->num ?? $rawLine?->prodCtx?->lineId ?? $rawLine?->prodCtx?->matchId ?? '',
            name: $rawLine?->name ?? null,
            trainName: $trainName,
            category: isset($rawLine?->prodCtx?->catOut) ? trim($rawLine->prodCtx->catOut) : null,
            number: $rawLine?->number ?? null,
            mode: $product?->mode,
            product: $product,
            operator: $this->operatorParser->parse($rawLineOperator),
            admin: $admin,
        );
    }
}