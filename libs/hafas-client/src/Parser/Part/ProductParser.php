<?php

declare(strict_types=1);

namespace Blue\HafasClient\Parser\Part;

use Blue\HafasClient\Models\Product;
use Blue\HafasClient\Profile\Config;

class ProductParser
{
    private array $productsByBitmask = [];

    public function __construct(private readonly Config $config)
    {
        foreach ($this->config->getProducts() as $product) {
            foreach ($product->bitmasks as $bitmask) {
                $this->productsByBitmask[$bitmask][] = $product;
            }
        }
    }

    /**
     * @param int $cls
     * @return Product[]
     */
    public function parse(int $cls): array
    {
        if (isset($this->productsByBitmask[$cls])) {
            return $this->productsByBitmask[$cls];
        }
        $result = [];
        foreach ($this->config->getProducts() as $product) {
            foreach ($product->bitmasks as $bitmask) {
                if ($cls & $bitmask) {
                    $result[] = $product;
                }
            }
        }
        return $result;
    }
}