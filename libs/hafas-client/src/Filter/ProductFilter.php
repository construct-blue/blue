<?php

namespace Blue\HafasClient\Filter;

use Blue\HafasClient\Exception\InvalidFilterException;
use Blue\HafasClient\Profile\Config;

/**
 * Class ProductFilter
 * @package HafasClient\Helper
 */
class ProductFilter
{
    private array $filter = [];

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
     * @param array $products
     *
     * @return int
     * @throws InvalidFilterException
     */
    private function createBitmask(Config $config, array $products): int
    {
        $allProducts = [];
        foreach ($config->getProducts() as $product) {
            $allProducts[$product->id] = $product;
        }

        if (count($products) === 0) {
            throw new InvalidFilterException();
        }
        $bitmask = 0;
        foreach ($products as $product) {
            if (isset($allProducts[$product])) {
                $bitmask += array_sum($allProducts[$product]->bitmasks);
            }
        }
        return $bitmask;
    }


    /**
     * @param Config $config
     * @return array
     * @throws InvalidFilterException
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