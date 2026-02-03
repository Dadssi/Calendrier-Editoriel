# Calendrier Éditorial

Un calendrier éditorial moderne pour planifier, organiser et suivre vos contenus jour par jour. L’interface est pensée pour être claire et agréable, avec un focus sur la productivité et la collaboration personnelle.

## Aperçu

- Planification par jour avec contenus, formats, plateformes et statuts
- CRUD complet connecté à une API PHP + MySQL
- Authentification admin simple
- UI conviviale et structurée (calendrier + sidebar de contenus)

## Technologies

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn-ui

**Backend**
- PHP (API)
- MySQL (Docker)

## Structure du projet

```
Calendrier_Editoriel/
  backend/
    public/
    src/
    sql/
    docker-compose.yml
  src/
  public/
```

## Prérequis

- Node.js + npm
- Docker Desktop
- MAMP (Apache)
- PHP (si besoin de debug local)

## Installation (Frontend)

```bash
git clone <YOUR_GIT_URL>
cd Calendrier_Editoriel
npm install
npm run dev
```

Par défaut, le frontend tourne sur `http://localhost:8081`.

## Installation (Backend)

### 1) Démarrer MySQL via Docker

```bash
docker compose -f backend/docker-compose.yml up -d
```

### 2) Importer la base de données

```bash
docker exec -i calendrier_editoriel_mysql mysql -u calendrier -pcalendrier calendrier_editoriel < backend/sql/schema.sql
```

### 3) Lancer l’API via MAMP

- **Document Root**: `Calendrier_Editoriel/backend/public`
- **Apache Port**: `8888`

Test rapide :
```bash
curl -s http://localhost:8888/health
```

## Authentification (admin)

Le login admin est défini en base dans la table `admins`.
Pour insérer un admin :

```bash
docker exec -i calendrier_editoriel_mysql mysql -u calendrier -pcalendrier calendrier_editoriel \
  -e "INSERT INTO admins (email, password_hash) VALUES ('email@exemple.com', '<PASSWORD_HASH>');"
```

> Le hash se génère en PHP :
```bash
php -r "echo password_hash('MotDePasse', PASSWORD_DEFAULT);"
```

## Configuration

### CORS (backend)
Dans `backend/src/config.php`, adaptez :

```php
'cors' => [
    'allowed_origin' => 'http://localhost:8081',
],
```

### API (frontend)
Vous pouvez fixer l’URL API via un `.env` à la racine :

```
VITE_API_BASE_URL=http://localhost:8888
```

## Usage

- Connectez-vous en tant qu’admin
- Ajoutez, modifiez et supprimez des contenus
- Les données sont stockées dans MySQL

## Production (idée de déploiement)

- Frontend : Vercel
- Backend PHP : Render ou Railway
- MySQL : service managé (Railway, Aiven, etc.)

## Licence

Projet personnel – usage privé.
