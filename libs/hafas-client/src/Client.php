<?php

namespace Blue\HafasClient;

use Blue\HafasClient\Parser\HafasResponseParserInterface;
use Blue\HafasClient\Request\HafasRequestInterface;
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\GuzzleException;
use Blue\HafasClient\Profile\Config;
use stdClass;

class Client
{

    private array $request;

    /**
     * @param array $request
     */
    public function __construct(array $request)
    {
        $this->request = $request;
    }

    public static function fromFile(string $file): Client
    {
        return new Client(json_decode(file_get_contents($file), true));
    }


    /**
     * @param Config $config
     * @param HafasRequestInterface $request
     * @param HafasResponseParserInterface $parser
     * @return mixed
     * @throws GuzzleException
     */
    public function request(Config $config, HafasRequestInterface $request, HafasResponseParserInterface $parser)
    {
        $client = new GuzzleClient();

        $requestBody = [
            'lang' => $config->getDefaultLanguage(),
            'svcReqL' => [$request->toArray($config)],
            'client' => $this->request['client'],
            'ver' => $this->request['ver'],
            'auth' => $this->request['auth'],
        ];

        if (isset($this->request['ext'])) {
            $requestBody['ext'] = $this->request['ext'];
        }

        $requestBody = json_encode($requestBody);

        $query = [];
        if ($config->isAddChecksum()) {
            $query['checksum'] = $this->getMac($requestBody, hex2bin($config->getSalt()));
        }

        if ($config->isAddMicMac()) {
            $query['mic'] = $this->getMic($requestBody);
            $query['mac'] = $this->getMac($requestBody, hex2bin($config->getSalt()));
        }

        $response = $client->post($config->getEndpoint() . '?' . http_build_query($query), [
            'body' => $requestBody,
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept-Encoding' => 'gzip, br, deflate',
                'User-Agent' => $config->getUserAgent() . uniqid(' '),
                'connection' => 'keep-alive',
            ]

        ]);
        return $parser->parse(json_decode($response->getBody()->getContents()));
    }

    private function getMic(string $requestBody): string
    {
        return md5($requestBody);
    }

    private function getMac(string $requestBody, string $salt): string
    {
        return md5($requestBody . $salt);
    }
}