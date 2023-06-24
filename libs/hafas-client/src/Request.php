<?php

namespace Blue\HafasClient;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Blue\HafasClient\Profile\Config;
use stdClass;

class Request
{

    private array $request;

    /**
     * @param array $request
     */
    public function __construct(array $request)
    {
        $this->request = $request;
    }

    public static function fromFile(string $file): Request
    {
        return new Request(json_decode(file_get_contents($file), true));
    }


    /**
     * @param Config $config
     * @param array $svcReqL
     *
     * @return stdClass
     * @throws GuzzleException
     */
    public function request(Config $config, array $svcReqL): stdClass
    {
        $client = new Client();

        $requestBody = [
            'lang' => $config->getDefaultLanguage(),
            'svcReqL' => [$svcReqL],
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
        return json_decode($response->getBody()->getContents());
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