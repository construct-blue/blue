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
    private string $nationalUICPrefix;
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
        string $nationalUICPrefix,
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
        $this->nationalUICPrefix = $nationalUICPrefix;
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
            nationalUICPrefix: (string)($config->nationalUICPrefix ?? ''),
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
     * @return string
     */
    public function getNationalUICPrefix(): string
    {
        return $this->nationalUICPrefix;
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
            '22' => 'UA',
            '51' => 'PL',
            '53' => 'RO',
            '54' => 'CZ',
            '55' => 'HU',
            '56' => 'SK',
            '70' => 'UK',
            '71' => 'ES',
            '73' => 'GR',
            '76' => 'NO',
            '78' => 'HR',
            '79' => 'SI',
            '80' => 'DE',
            '81' => 'AT',
            '82' => 'LU',
            '83' => 'IT',
            '84' => 'NL',
            '85' => 'CH',
            '86' => 'DK',
            '87' => 'FR',
            '88' => 'BG',
        ];
    }
}