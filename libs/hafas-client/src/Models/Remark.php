<?php

namespace Blue\HafasClient\Models;

use JsonSerializable;

/**
 * @package HafasClient\Models
 */
readonly class Remark implements JsonSerializable
{
    public function __construct(
        public ?string $type = null,
        public ?string $code = null,
        public ?int $prio = null,
        public ?string $message = null
    ) {
    }

    public function jsonSerialize(): array
    {
        return [
            'type' => $this->type,
            'code' => $this->code,
            'prio' => $this->prio,
            'message' => $this->message
        ];
    }

    /**
     * @return string
     * @todo
     */
    public function __toString(): string
    {
        return json_encode($this);
    }
}