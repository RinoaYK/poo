-- Active: 1681830347985@@127.0.0.1@3306

CREATE TABLE movies (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,    
    duration INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime')) NOT NULL
);

INSERT INTO movies (id, title, duration)
VALUES
	("f001", "Filme1", 120),
    ("f002", "Filme2", 160),
	("f003", "Filme3", 90);

SELECT * FROM movies;

DROP TABLE movies;