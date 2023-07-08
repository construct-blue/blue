<?php

declare(strict_types=1);

namespace Blue\HafasClient\Profile;

use Blue\HafasClient\Models\Operator;
use Blue\HafasClient\Models\Product;
use stdClass;

class Config
{
    private string $userAgent;
    private string $endpoint;
    private ?string $salt;
    private string $defaultLanguage;
    private bool $addMicMac;
    private bool $addChecksum;
    private int $defaultTZOffset;

    /** @var Product[] */
    private array $products;

    /** @var Operator[] */
    private array $operators;


    /**
     * @param string $userAgent
     * @param string $endpoint
     * @param string|null $salt
     * @param string $defaultLanguage
     * @param bool $addMicMac
     * @param bool $addChecksum
     * @param int $defaultTZOffset
     * @param Product[] $products
     * @param Operator[] $operators
     */
    public function __construct(
        string $userAgent,
        string $endpoint,
        ?string $salt,
        string $defaultLanguage,
        bool $addMicMac,
        bool $addChecksum,
        int $defaultTZOffset,
        array $products,
        array $operators
    ) {
        $this->userAgent = $userAgent;
        $this->endpoint = $endpoint;
        $this->salt = $salt;
        $this->defaultLanguage = $defaultLanguage;
        $this->addMicMac = $addMicMac;
        $this->addChecksum = $addChecksum;
        $this->defaultTZOffset = $defaultTZOffset;
        $this->products = $products;
        $this->operators = $operators;
    }

    public static function fromFile(string $filename): Config
    {
        $config = json_decode(file_get_contents($filename));
        return new Config(
            userAgent: $config->userAgent ?? 'hafas-php-client',
            endpoint: $config->endpoint,
            salt: (string)($config->salt ?? ''),
            defaultLanguage: (string)($config->defaultLanguage ?? 'en'),
            addMicMac: (bool)($config->addMicMac ?? false),
            addChecksum: (bool)($config->addChecksum ?? false),
            defaultTZOffset: (int)($config->defaultTZOffset ?? 0),
            products: array_map(
                fn(stdClass $product) => new Product(
                    id: (string)($product->id ?? ''),
                    mode: (string)($product->mode ?? ''),
                    bitmasks: array_map('intval', $product->bitmasks),
                    name: (string)($product->name ?? ''),
                    short: (string)($product->short ?? ''),
                    default: (bool)$product->default
                ),
                $config->products ?? []
            ),
            operators: array_map(
                fn(stdClass $operator) => new Operator(
                    id: (string)$operator->id,
                    name: (string)$operator->name,
                    displayName: isset($operator->displayName) ? (string)$operator->displayName : null,
                    uic: isset($operator->uic) ? (string)$operator->uic : null
                ),
                $config->operators ?? []
            )
        );
    }

    /**
     * @return string
     */
    public function getUserAgent(): string
    {
        return $this->userAgent;
    }

    /**
     * @return string
     */
    public function getEndpoint(): string
    {
        return $this->endpoint;
    }

    /**
     * @return string|null
     */
    public function getSalt(): ?string
    {
        return $this->salt;
    }

    /**
     * @return string
     */
    public function getDefaultLanguage(): string
    {
        return $this->defaultLanguage;
    }

    /**
     * @return bool
     */
    public function isAddMicMac(): bool
    {
        return $this->addMicMac;
    }

    /**
     * @return bool
     */
    public function isAddChecksum(): bool
    {
        return $this->addChecksum;
    }

    /**
     * @return int
     */
    public function getDefaultTZOffset(): int
    {
        return $this->defaultTZOffset;
    }

    /**
     * @return Product[]
     */
    public function getProducts(): array
    {
        return $this->products;
    }

    /**
     * @return Operator[]
     */
    public function getOperators(): array
    {
        return $this->operators;
    }

    public function getUICPrefixes(): array
    {
        return [
            '80' => 'DE',
            '81' => 'AT',
            '84' => 'NL',
            '85' => 'CH',
        ];
    }
}