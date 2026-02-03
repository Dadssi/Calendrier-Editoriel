<?php

declare(strict_types=1);

return [
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3307,
        'name' => 'calendrier_editoriel',
        'user' => 'calendrier',
        'pass' => 'calendrier',
        'charset' => 'utf8mb4',
    ],
    'auth' => [
        // Change this to a long random string before production.
        'token_secret' => 'CHANGE_ME_LONG_RANDOM_SECRET',
        // Token TTL in seconds (default 7 days)
        'token_ttl' => 60 * 60 * 24 * 7,
    ],
    'cors' => [
        // Frontend origin for local dev
        'allowed_origin' => 'http://localhost:8081',
    ],
];
