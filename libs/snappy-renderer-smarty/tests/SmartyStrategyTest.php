<?php

declare(strict_types=1);

namespace BlueTest\Snappy\Renderer\Strategy\Smarty;

use Blue\Snappy\Renderer\Exception\RenderException;
use Blue\Snappy\Renderer\Renderer;
use Blue\Snappy\Renderer\Strategy\ClosureStrategy;
use Blue\Snappy\Renderer\Strategy\InvalidViewStrategy;
use Blue\Snappy\Renderer\Strategy\Smarty\SmartyStrategy;
use Blue\Snappy\Renderer\Strategy\Smarty\SmartyTemplate;
use PHPUnit\Framework\TestCase;

class SmartyStrategyTest extends TestCase
{
    /**
     * @return void
     * @throws RenderException
     */
    public function testShouldRenderSmartyTemplatesWithRenderArguments()
    {
        $template = new SmartyTemplate(__DIR__ . '/templates/heading.tpl');

        $renderer = new Renderer(new SmartyStrategy(new InvalidViewStrategy()));

        $result = $renderer->render($template, $renderer->args([
            'heading' => 'Hello world!',
            'paragraph' => 'Greetings from Smarty.'
        ]));

        $expected = <<<HTML
<h1>Hello world!</h1>
<p>Greetings from Smarty.</p>
HTML;
        self::assertEquals($expected, $result);
    }


    /**
     * @return void
     * @throws RenderException
     */
    public function testShouldAllowRenderablesAsSubTemplates()
    {
        $template = new SmartyTemplate(__DIR__ . '/templates/renderable.tpl');

        $renderer = new Renderer(new ClosureStrategy(new SmartyStrategy(new InvalidViewStrategy())));

        $result = $renderer->render($template);

        $expected = <<<HTML
<h1>Hello world!</h1>
<p>Greetings from Smarty.</p>
HTML;
        self::assertEquals($expected, $result);
    }

    /**
     * @return void
     * @throws RenderException
     */
    public function testShouldOverrideGlobalArguments()
    {
        $template = new SmartyTemplate(__DIR__ . '/templates/heading.tpl');

        $renderer = new Renderer(new SmartyStrategy(new InvalidViewStrategy()));
        $template->assign('heading', 'Hello there!');
        $result = $renderer->render($template, $renderer->args([
            'heading' => 'Hello world!',
            'paragraph' => 'Greetings from Smarty.'
        ]));

        $expected = <<<HTML
<h1>Hello there!</h1>
<p>Greetings from Smarty.</p>
HTML;
        self::assertEquals($expected, $result);
    }
}