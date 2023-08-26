<?php

declare(strict_types=1);

namespace BlueTest\TrainsearchApi\Hafas;

use Blue\TrainsearchApi\Hafas\Exception\BadRequestException;
use Blue\TrainsearchApi\Hafas\HafasRequest;
use Generator;
use Laminas\Diactoros\ServerRequest;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface;

class HafasRequestTest extends TestCase
{

    private static function createValidRequest()
    {
        $request = new ServerRequest();
        $request = $request->withAttribute('profile', 'oebb');
        $request = $request->withAttribute('query', rawurlencode('RJ 79'));
        return $request;
    }


    public static function dataProvider_BadRequest(): Generator
    {
        yield 'missing profile' => [self::createValidRequest()->withoutAttribute('profile')];
        yield 'missing query' => [self::createValidRequest()->withoutAttribute('query')];
    }


    /**
     * @dataProvider dataProvider_BadRequest
     * @param ServerRequestInterface $request
     * @return void
     */
    public function testShouldThrowExceptionInvalidRequest(ServerRequestInterface $request): void
    {
        self::expectException(BadRequestException::class);
        new HafasRequest($request);
    }


    /**
     * @return void
     * @throws BadRequestException
     */
    public function testShouldCreateFromValidRequest()
    {
        $request = new HafasRequest(self::createValidRequest());
        self::assertEquals('oebb', $request->getProfile());
        self::assertEquals('RJ 79', $request->getQuery());
    }

    /**
     * @return void
     * @throws BadRequestException
     */
    public function testShouldCreateFromValidRequestWithOptionalParams()
    {
        $request = new HafasRequest(
            self::createValidRequest()->withQueryParams(['operator' => 'dbfern'])
        );
        self::assertEquals('dbfern', $request->getOperator());
    }
}
