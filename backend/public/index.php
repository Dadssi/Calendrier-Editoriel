<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/Response.php';
require_once __DIR__ . '/../src/Auth.php';

$config = require __DIR__ . '/../src/config.php';
$db = new Database($config);
$pdo = $db->pdo();

// CORS (adjust allowed_origin in config.php)
$origin = $config['cors']['allowed_origin'] ?? '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$path = rtrim($path, '/');
if ($path === '') {
    $path = '/';
}

function getJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        Response::error('Invalid JSON body', 400);
    }
    return $data;
}

function requireAuth(array $config): string
{
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if ($auth === '' && isset($_SERVER['HTTP_X_AUTH_TOKEN'])) {
        $auth = 'Bearer ' . $_SERVER['HTTP_X_AUTH_TOKEN'];
    }
    if ($auth === '' && function_exists('getallheaders')) {
        $headers = getallheaders();
        foreach ($headers as $name => $value) {
            if (strtolower($name) === 'authorization') {
                $auth = $value;
                break;
            }
        }
    }
    if (!preg_match('/^Bearer\s+(.*)$/i', $auth, $m)) {
        Response::error('Missing auth token', 401);
    }

    $token = $m[1];
    $payload = Auth::verifyToken($token, $config['auth']['token_secret']);
    if (!$payload || empty($payload['sub'])) {
        Response::error('Invalid or expired token', 401);
    }

    return (string) $payload['sub'];
}

function normalizeContentRow(array $row): array
{
    if (isset($row['platforms'])) {
        $decoded = json_decode((string)$row['platforms'], true);
        $row['platforms'] = is_array($decoded) ? $decoded : [];
    }

    if (isset($row['time'])) {
        $time = (string)$row['time'];
        if (strlen($time) >= 5) {
            $row['time'] = substr($time, 0, 5);
        }
    }

    return $row;
}

// Health
if ($path === '/health' && $method === 'GET') {
    Response::json(['ok' => true]);
}

// Login
if ($path === '/auth/login' && $method === 'POST') {
    $body = getJsonBody();
    $email = trim((string)($body['email'] ?? ''));
    $password = (string)($body['password'] ?? '');

    if ($email === '' || $password === '') {
        Response::error('Email and password are required', 422);
    }

    $stmt = $pdo->prepare('SELECT id, password_hash FROM admins WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => $email]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        Response::error('Invalid credentials', 401);
    }

    $token = Auth::createToken((string)$admin['id'], $config['auth']['token_secret'], (int)$config['auth']['token_ttl']);
    Response::json(['token' => $token]);
}

// CRUD requires auth
$adminId = null;
if (str_starts_with($path, '/contents')) {
    $adminId = requireAuth($config);
}

// GET /contents
if ($path === '/contents' && $method === 'GET') {
    $date = isset($_GET['date']) ? trim((string)$_GET['date']) : '';

    if ($date !== '') {
        $stmt = $pdo->prepare('SELECT * FROM contents WHERE date = :date ORDER BY time ASC');
        $stmt->execute(['date' => $date]);
    } else {
        $stmt = $pdo->query('SELECT * FROM contents ORDER BY date ASC, time ASC');
    }

    $rows = array_map('normalizeContentRow', $stmt->fetchAll());
    Response::json($rows);
}

// POST /contents
if ($path === '/contents' && $method === 'POST') {
    $body = getJsonBody();

    $required = ['date', 'title', 'description', 'platforms', 'format', 'genre', 'subGenre', 'time', 'status'];
    foreach ($required as $key) {
        if (!array_key_exists($key, $body)) {
            Response::error('Missing field: ' . $key, 422);
        }
    }

    $stmt = $pdo->prepare(
        'INSERT INTO contents (date, title, description, platforms, format, genre, subGenre, time, status)
         VALUES (:date, :title, :description, :platforms, :format, :genre, :subGenre, :time, :status)'
    );

    $stmt->execute([
        'date' => $body['date'],
        'title' => $body['title'],
        'description' => $body['description'],
        'platforms' => json_encode($body['platforms'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'format' => $body['format'],
        'genre' => $body['genre'],
        'subGenre' => $body['subGenre'],
        'time' => $body['time'],
        'status' => $body['status'],
    ]);

    $id = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM contents WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();

    Response::json(normalizeContentRow($row), 201);
}

// PUT /contents/{id}
if (preg_match('#^/contents/(\d+)$#', $path, $m) && $method === 'PUT') {
    $id = (int)$m[1];
    $body = getJsonBody();

    $allowed = ['date','title','description','platforms','format','genre','subGenre','time','status'];
    $fields = [];
    $params = ['id' => $id];

    foreach ($allowed as $key) {
        if (array_key_exists($key, $body)) {
            $fields[] = $key . ' = :' . $key;
            $params[$key] = ($key === 'platforms')
                ? json_encode($body[$key], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
                : $body[$key];
        }
    }

    if (count($fields) === 0) {
        Response::error('No fields to update', 422);
    }

    $sql = 'UPDATE contents SET ' . implode(', ', $fields) . ' WHERE id = :id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $stmt = $pdo->prepare('SELECT * FROM contents WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();

    if (!$row) {
        Response::error('Content not found', 404);
    }

    Response::json(normalizeContentRow($row));
}

// DELETE /contents/{id}
if (preg_match('#^/contents/(\d+)$#', $path, $m) && $method === 'DELETE') {
    $id = (int)$m[1];

    $stmt = $pdo->prepare('DELETE FROM contents WHERE id = :id');
    $stmt->execute(['id' => $id]);

    Response::json(['deleted' => true]);
}

Response::error('Not found', 404);
