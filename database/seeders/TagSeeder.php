<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$tags = [
			'laravel',
			'symfony',
			'vue',
			'react',
			'tailwindcss',
			'alpinejs',
			'livewire',
			'inertiajs',
			'next.js',
			'nuxt.js',
			'angular',
			'express.js',
			'flask',
			'django',
			'ruby on rails',
			'phoenix',
			'node.js',
			'.NET',
			'C#',
			'Java',
			'Python',
			'PHP',
			'Go',
			'Ruby',
			'JavaScript',
			'TypeScript',
			'HTML',
			'CSS',
			'SASS',
			'LESS',
			'Bootstrap',
			'Chakra UI',
			'Svelte',
			'Ember.js',
			'Backbone.js',
			'Meteor',
			'ASP.NET',
			'Spring',
			'FastAPI',
			'Koa',
			'Hapi',
			'CodeIgniter',
			'Zend Framework',
			'Yii',
			'CakePHP',
			'Slim',
			'Grails',
			'Play',
			'JHipster',
			'Quarkus',
			'Micronaut',
			'Dropwizard',
			'Spark',
			'Vaadin',
			'Blade',
			'Jinja',
			'Twig',
			'Handlebars',
			'Mustache',
			'EJS',
			'Pug',
			'Haml',
			'Liquid',
			'Smarty',
			'Thymeleaf'
		];

		foreach ($tags as $tag) {
			DB::table('tags')->insert(['name' => $tag]);
		}
	}
}
