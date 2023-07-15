<?php

namespace Blue\HafasClient\Models;

/**
 * @package HafasClient\Models
 */
readonly class Line implements \JsonSerializable
{

    public function __construct(
        public string    $id,
        public ?string   $name = null,
        public ?string   $trainName = null,
        public ?string   $category = null,
        public ?string   $number = null,
        public ?string   $mode = null,
        public ?Product  $product = null,
        public ?Operator $operator = null,
        public ?string   $admin = null
    )
    {

    }

    public function jsonSerialize(): mixed
    {
        return [
            'type' => 'line',
            'id' => $this->id,
            'name' => $this->name,
            'trainName' => $this->trainName,
            'category' => $this->category,
            'number' => $this->number,
            'mode' => $this->mode,
            'product' => $this->product ?? null,
            'operator' => $this->operator ?? null,
            'admin' => $this->admin ?? null,
        ];
    }

    public function __toString(): string
    {
        return json_encode($this);
    }
}