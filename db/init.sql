-- Schéma de la base « notesdb » (projet fil rouge)
CREATE TABLE IF NOT EXISTS notes (
    id          SERIAL PRIMARY KEY,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO notes (content) VALUES
    ('Bienvenue dans la formation DevOps !'),
    ('Cette note vient de la base PostgreSQL.');
