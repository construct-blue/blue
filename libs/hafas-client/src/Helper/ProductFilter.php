<?php

namespace Blue\HafasClient\Helper;

use Blue\HafasClient\Exception\ProductNotFoundException;
use Blue\HafasClient\Exception\InvalidFilterException;
use Blue\HafasClient\Profile\Config;

/**
 * Class ProductFilter
 * @package HafasClient\Helper
 */
class ProductFilter
{
    private $filter = [];

    /**
     * @param array $products
     *
     * @return int
     * @throws InvalidFilterException
     */
    public function createBitmask(Config $config, array $products): int
    {
        $allProducts = [];
        foreach ($config->getProducts() as $product) {
            $allProducts[$product->id] = $product;
        }

        if (count($products) == 0) {
            throw new InvalidFilterException();
        }
        $bitmask = 0;
        foreach ($products as $product) {
            if (array_key_exists($product, $allProducts)) {
                $bitmask += $allProducts[$product]->bitmasks[0];
            }
        }
        return $bitmask;
    }


    public function __construct()
    {
        $this->filter[] = 'nationalExpress';
        $this->filter[] = 'national';
        $this->filter[] = 'regionalExpress';
        $this->filter[] = 'regional';
        $this->filter[] = 'interregional';
        $this->filter[] = 'suburban';
    }

    /**
     * @return array
     * @throws ProductNotFoundException|InvalidFilterException
     */
    public function filter(Config $config): array
    {
        return [
            'type' => 'PROD',
            'mode' => 'INC',
            'value' => (string)$this->createBitmask($config, $this->filter)
        ];
    }
}