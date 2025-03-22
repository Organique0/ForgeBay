Za localno testiranje je zelo priporočeno uporabiti Laravel Sail.
Drugače je potrebno imeti Larael, Postgreql in Redis že nameščen.
Dokumentacija: https://laravel.com/docs/12.x/sail

Povzetek

Zahtevano: 
- MacOs, Linux ali WSL2.
- Docker nameščen in zagnan
- nameščen in pravilno nastavljen PHP in Composer

Uporaba:
(Terminal odprt v mapi projekta. Najlažje vsak ukaz v svojem oknu. Ni potrebno za vse, će veste za katere. Okna je najbolje imeti ves čas odprta. Zaradi izpisov in enostavne ustavitve)
./vendor/bin/sail je lahko dodan kot alias za lažjo uporabo v bash, fish ali zsh config: alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'

Ukazi brez uporabe aliasa:
- composer install (verjetno bo potrebno omogočiti določene php vtičnike. Odvnisno od os. Na Linux je /etc/php mapa)
- ./vendor/bin/sail up
- ./vendor/bin/sail npm run dev
- ./vendor/bin/sail queue:work
- ./vendor/bin/sail reverb:start

Priprava podatkovne baze (Najlažje v enem novem oknu. Enega za drugim.):
- ./vendor/bin/sail artisan migrate
- ./vendor/bin/sail artisan db:seed

Ukaz stavitev:
- ./vendor/bin/sail down

Najlažja ustavitev:
- okno kjer poteka ukaz ./vendor/bin/sail up
- CTRL + C

Če je terminal samo zaprt. To najverjetneje ne bo zaustavilo Sail. V tem primeru je potrebno novo okno v terminalu v mapi projekta in ukaz: ./vendor/bin/sail down.
Docker storitev bo seveda še vedno aktiva tudi po zaustavitvi Sail.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

For local testing it is very recommended to use Laravel Sail. That is why it exists.
Otherwise you need to have things like laravel, postgresql and redis installed on your system.
Documentation: https://laravel.com/docs/12.x/sail

Everything is described in the documentation.

Commands you need to execute in separate terminal windows (in the root folder):
- composer install (If you are missing certain PHP extensions it will tell you which. php.ini on Linux is in /etc/php.)
- ./vendor/bin/sail up
- ./vendor/bin/sail npm run dev
- ./vendor/bin/sail queue:work
- ./vendor/bin/sail reverb:start

Database can be prepared using only 2 commands:
- ./vendor/bin/sail artisan migrate
- ./vendor/bin/sail artisan db:seed

If they fail. It is usually because the order in which migrations get executed is wrong.
Migrations are executed in order of timestamps in the name of the migration.
Seeding generates a lot of data and may take some time.

You can also stop Laravel Sail by just pressing CTLR+C in it's terminal window.
Stoping it will also terminate other services but won't terminate the Docker service.
