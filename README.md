# App fil rouge — « DevOps Notes »

Application web 3-tiers servant de support à tous les labs.

```
┌────────────┐     HTTP      ┌────────────┐     SQL      ┌────────────┐
│  frontend  │ ───────────▶ │    api     │ ───────────▶ │ PostgreSQL │
│ (static)   │              │ (Node.js)  │              │   (db)     │
└────────────┘              └────────────┘              └────────────┘
```

## Composants
- **frontend/** : page statique (HTML + JS) qui liste et ajoute des notes.
- **api/** : API REST Node.js/Express. Endpoints :
  - `GET /healthz` — liveness probe
  - `GET /readyz` — readiness probe (vérifie la base)
  - `GET /metrics` — métriques Prometheus (lab J6)
  - `GET /api/notes` — liste les notes
  - `POST /api/notes` — ajoute une note `{ "content": "..." }`
- **db/** : schéma PostgreSQL (`init.sql`).

## Lancement local (Docker Compose)
```bash
cd app-fil-rouge
docker compose up --build -d
# Frontend : http://localhost:8080
# API      : http://localhost:3000/api/notes
docker compose down -v   # arrêt + suppression des volumes
```

## Variables d'environnement de l'API
| Variable | Défaut | Rôle |
|---|---|---|
| `PORT` | 3000 | Port d'écoute de l'API |
| `DB_HOST` | db | Hôte PostgreSQL |
| `DB_PORT` | 5432 | Port PostgreSQL |
| `DB_USER` | notes | Utilisateur |
| `DB_PASSWORD` | notes | Mot de passe (à mettre en secret !) |
| `DB_NAME` | notesdb | Base |

> Le mot de passe en clair est **volontairement** présent pour servir de support
> au lab « gestion des secrets » (J5/J6).

## Utilisation dans le fil rouge
J1 versionnement · J2 CI · J3 image Docker · J4 déploiement k3s · J5 IaC · J6 obs/sécu/GitOps.
