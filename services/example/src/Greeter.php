<?php

declare(strict_types=1);

namespace Blue\Example;

class Greeter
{
    public function greet(string $name): string
    {
        return "Hello $name!";
    }
}