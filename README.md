Za localno testiranje je zelo priporočeno uporabiti Laravel Sail.
Drugače je potrebno imeti Larael, Postgreql in Redis že nameščen.
Dokumentacija: https://laravel.com/docs/12.x/sail

Povzetek

Zahtevano: 
- MacOs, Linux ali WSL2.
- Docker nameščen in zagnan (Linux ukaz za zagon Docker storitve: sudo systemctl start docker, Windows: Uporabi Docker Desktop)
- nameščen in pravilno nastavljen PHP in Composer

!! Če Docker storitev ne dela na Linux, je verjetno potreben ukaz: docker context use default. !!

Uporaba:
(Terminal odprt v mapi projekta. Najlažje vsak ukaz v svojem oknu. Ni potrebno za vse, će veste za katere. Okna je najbolje imeti ves čas odprta. Zaradi izpisov in enostavne ustavitve)
./vendor/bin/sail je lahko dodan kot alias za lažjo uporabo v bash, fish ali zsh config: alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'

Ukazi brez uporabe aliasa:
- composer install (verjetno bo potrebno omogočiti določene php vtičnike (iconv in intl). Odvnisno od os. Na Linux je to /etc/php mapa). 
- ./vendor/bin/sail up
- ./vendor/bin/sail npm install
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
Tutorial for those who have no idea what they are doing.

Requirements:
- MacOs, Linux or WSL2.
- Docker installed and docker service active (Linux command to start the service: sudo systemctl start docker. Windows: Just use Docker Desktop)
- Installed and properly configured PHP and Composer

For local testing it is very recommended to use Laravel Sail. That is why it exists.
Otherwise you need to have things like laravel, postgresql and redis installed on your system.
Documentation: https://laravel.com/docs/12.x/sail

Everything is described in the documentation.

!! If you are using Docker Desktop for Linux, you should use the default Docker context by executing the following command: docker context use default. !!

Commands you need to execute in separate terminal windows (in the root folder):
- composer install (If you are missing certain PHP extensions it will tell you which. (Most likely iconv and intl) php.ini on Linux is in /etc/php.)
- ./vendor/bin/sail up
- ./vendor/bin/sail npm install
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
