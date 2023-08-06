<?php

namespace Blue\HafasClient\Models;

use DateTime;
use JsonSerializable;

/**
 * @package HafasClient\Models
 */
readonly class Stopover implements JsonSerializable
{
    /**
     * @param Stop $stop
     * @param int|null $index
     * @param DateTime|null $plannedArrival
     * @param DateTime|null $arrival
     * @param string|null $arrivalPlatform
     * @param DateTime|null $plannedDeparture
     * @param DateTime|null $departure
     * @param string|null $departurePlatform
     * @param bool|null $requestStop
     * @param bool|null $isCancelled
     * @param int|null $delay
     * @param int|null $arrivalDelay
     * @param int|null $departureDelay
     * @param bool|null $reported
     * @param string|null $progType
     * @param bool|null $border
     * @param Line|null $line
     * @param bool|null $changedLine
     * @param Remark[] $remarks
     * @param Information[] $infos
     */
    public function __construct(
        public Stop $stop,
        public ?int $index = null,
        public ?DateTime $plannedArrival = null,
        public ?DateTime $arrival = null,
        public ?string $arrivalPlatform = null,
        public ?DateTime $plannedDeparture = null,
        public ?DateTime $departure = null,
        public ?string $departurePlatform = null,
        public ?bool $requestStop = null,
        public ?bool $isCancelled = null,
        public ?int $delay = null,
        public ?int $arrivalDelay = null,
        public ?int $departureDelay = null,
        public ?bool $reported = null,
        public ?string $progType = null,
        public ?bool $border = null,
        public ?Line $line = null,
        public ?bool $changedLine = null,
        public array $remarks = [],
        public array $infos = []
    ) {
    }

    public function jsonSerialize(): array
    {
        return [
            'type' => 'stopover',
            'stop' => $this->stop ?? null,
            'index' => $this->index,
            'plannedArrival' => $this->plannedArrival?->format(DATE_ATOM),
            'arrival' => $this->arrival?->format(DATE_ATOM),
            'arrivalPlatform' => $this->arrivalPlatform,
            'plannedDeparture' => $this->plannedDeparture?->format(DATE_ATOM),
            'departure' => $this->departure?->format(DATE_ATOM),
            'departurePlatform' => $this->departurePlatform,
            'requestStop' => $this->requestStop,
            'isCancelled' => $this->isCancelled,
            'delay' => $this->delay,
            'arrivalDelay' => $this->arrivalDelay,
            'departureDelay' => $this->departureDelay,
            'reported' => $this->reported,
            'progType' => $this->progType,
            'border' => $this->border,
            'remarks' => $this->remarks,
            'infos' => $this->infos,
            'line' => $this->line,
            'changedLine' => $this->changedLine,
        ];
    }

    public function __toString(): string
    {
        return json_encode($this);
    }
}
