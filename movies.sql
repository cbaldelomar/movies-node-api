-- CREATE DATABASE STRUCTURE --
-------------------------------
CREATE DATABASE IF NOT EXISTS MoviesDB;

USE MoviesDB;

DROP TABLE IF EXISTS MovieGenre;
DROP TABLE IF EXISTS Movie;
DROP TABLE IF EXISTS Genre;

CREATE TABLE Movie(
	Id BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), true)),
    UUID CHAR(36) AS (BIN_TO_UUID(id, true)),
    Title VARCHAR(100) NOT NULL,
    Year INT NOT NULL,
    Director VARCHAR(100) NOT NULL,
    Duration SMALLINT UNSIGNED NOT NULL,
    Poster TEXT,
    Rate DECIMAL(2, 1),
    CreatedAt DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (Id),
    UNIQUE AK_Movie_Title_Year_Director (Title, Year, Director),
    CONSTRAINT CHK_Movie_Year CHECK (Year >= 1900),
    CONSTRAINT CHK_Movie_Rate CHECK (Rate BETWEEN 0 AND 10)
);

CREATE TABLE Genre(
	Id INT AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    PRIMARY KEY (Id),
    UNIQUE AK_Genre_Name (Name)
);

CREATE TABLE MovieGenre(
	MovieId BINARY(16) NOT NULL,
    GenreId INT NOT NULL,
    PRIMARY KEY (MovieId, GenreId),
    CONSTRAINT FK_MovieGenre_Movie_MovieId FOREIGN KEY (MovieId) REFERENCES Movie(Id) ON DELETE CASCADE,
    CONSTRAINT FK_MovieGenre_Genre_GenreId FOREIGN KEY (GenreId) REFERENCES Genre(Id),
    INDEX IX_FK_MovieGenre_Movie_MovieId (MovieId),
    INDEX IX_FK_MovieGenre_Genre_GenreId (GenreId)
);

-- CREATE INDEX IX_FK_MovieGenre_Movie_MovieId ON MovieGenre(MovieId);
-- CREATE INDEX IX_FK_MovieGenre_Genre_GenreId ON MovieGenre(GenreId);

-- FEED DATA --
---------------
-- Insertar géneros únicos en la tabla 'Genre'
INSERT INTO Genre (Name)
VALUES
('Drama'),
('Action'),
('Crime'),
('Adventure'),
('Sci-Fi'),
('Romance'),
('Animation'),
('Biography'),
('Fantasy');

-- Insertar películas en la tabla 'Movie'
INSERT INTO Movie (Title, Year, Director, Duration, Poster, Rate)
VALUES
('The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 9.3),
('The Dark Knight', 2008, 'Christopher Nolan', 152, 'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg', 9.0),
('Inception', 2010, 'Christopher Nolan', 148, 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8),
('Pulp Fiction', 1994, 'Quentin Tarantino', 154, 'https://www.themoviedb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', 8.9),
('Forrest Gump', 1994, 'Robert Zemeckis', 142, 'https://i.ebayimg.com/images/g/qR8AAOSwkvRZzuMD/s-l1600.jpg', 8.8),
('Gladiator', 2000, 'Ridley Scott', 155, 'https://img.fruugo.com/product/0/60/14417600_max.jpg', 8.5),
('The Matrix', 1999, 'Lana Wachowski', 136, 'https://i.ebayimg.com/images/g/QFQAAOSwAQpfjaA6/s-l1200.jpg', 8.7),
('Interstellar', 2014, 'Christopher Nolan', 169, 'https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg', 8.6),
('The Lord of the Rings: The Return of the King', 2003, 'Peter Jackson', 201, 'https://i.ebayimg.com/images/g/0hoAAOSwe7peaMLW/s-l1600.jpg', 8.9),
('The Lion King', 1994, 'Roger Allers, Rob Minkoff', 88, 'https://m.media-amazon.com/images/I/81BMmrwSFOL._AC_UF1000,1000_QL80_.jpg', 8.5),
('The Avengers', 2012, 'Joss Whedon', 143, 'https://img.fruugo.com/product/7/41/14532417_max.jpg', 8.0),
('Jurassic Park', 1993, 'Steven Spielberg', 127, 'https://vice-press.com/cdn/shop/products/Jurassic-Park-Editions-poster-florey.jpg?v=1654518755&width=1024', 8.1),
('Titanic', 1997, 'James Cameron', 195, 'https://i.pinimg.com/originals/42/42/65/4242658e6f1b0d6322a4a93e0383108b.png', 7.8),
('The Social Network', 2010, 'David Fincher', 120, 'https://i.pinimg.com/originals/7e/37/b9/7e37b994b613e94cba64f307b1983e39.jpg', 7.7),
('Avatar', 2009, 'James Cameron', 162, 'https://i.etsystatic.com/35681979/r/il/dfe3ba/3957859451/il_fullxfull.3957859451_h27r.jpg', 7.8);

-- Insertar relaciones entre películas y géneros en la tabla 'MovieGenre'

INSERT INTO MovieGenre (MovieId, GenreId)
VALUES
-- Película: The Shawshank Redemption
((SELECT Id FROM Movie WHERE Title = 'The Shawshank Redemption'), (SELECT Id FROM Genre WHERE Name = 'Drama')),
-- Película: The Dark Knight
((SELECT Id FROM Movie WHERE Title = 'The Dark Knight'), (SELECT Id FROM Genre WHERE Name = 'Action')),
((SELECT Id FROM Movie WHERE Title = 'The Dark Knight'), (SELECT Id FROM Genre WHERE Name = 'Crime')),
((SELECT Id FROM Movie WHERE Title = 'The Dark Knight'), (SELECT Id FROM Genre WHERE Name = 'Drama')),
-- Película: Inception
((SELECT Id FROM Movie WHERE Title = 'Inception'), (SELECT Id FROM Genre WHERE Name = 'Action')),
((SELECT Id FROM Movie WHERE Title = 'Inception'), (SELECT Id FROM Genre WHERE Name = 'Adventure')),
((SELECT Id FROM Movie WHERE Title = 'Inception'), (SELECT Id FROM Genre WHERE Name = 'Sci-Fi')),
-- Película: Pulp Fiction
((SELECT Id FROM Movie WHERE Title = 'Pulp Fiction'), (SELECT Id FROM Genre WHERE Name = 'Crime')),
((SELECT Id FROM Movie WHERE Title = 'Pulp Fiction'), (SELECT Id FROM Genre WHERE Name = 'Drama')),
-- Película: Forrest Gump
((SELECT Id FROM Movie WHERE Title = 'Forrest Gump'), (SELECT Id FROM Genre WHERE Name = 'Drama')),
((SELECT Id FROM Movie WHERE Title = 'Forrest Gump'), (SELECT Id FROM Genre WHERE Name = 'Romance')),
-- Película: Gladiator
((SELECT Id FROM Movie WHERE Title = 'Gladiator'), (SELECT Id FROM Genre WHERE Name = 'Action')),
((SELECT Id FROM Movie WHERE Title = 'Gladiator'), (SELECT Id FROM Genre WHERE Name = 'Adventure')),
((SELECT Id FROM Movie WHERE Title = 'Gladiator'), (SELECT Id FROM Genre WHERE Name = 'Drama')),
-- Película: The Matrix
((SELECT Id FROM Movie WHERE Title = 'The Matrix'), (SELECT Id FROM Genre WHERE Name = 'Action')),
((SELECT Id FROM Movie WHERE Title = 'The Matrix'), (SELECT Id FROM Genre WHERE Name = 'Sci-Fi')),
-- Película: Interstellar
((SELECT Id FROM Movie WHERE Title = 'Interstellar'), (SELECT Id FROM Genre WHERE Name = 'Adventure')),
((SELECT Id FROM Movie WHERE Title = 'Interstellar'), (SELECT Id FROM Genre WHERE Name = 'Drama')),
((SELECT Id FROM Movie WHERE Title = 'Interstellar'), (SELECT Id FROM Genre WHERE Name = 'Sci-Fi')),
-- Película: The Lord of the Rings: The Return of the King
((SELECT Id FROM Movie WHERE Title = 'The Lord of the Rings: The Return of the King'), (SELECT Id FROM Genre WHERE Name = 'Action')),
((SELECT Id FROM Movie WHERE Title = 'The Lord of the Rings: The Return of the King'), (SELECT Id FROM Genre WHERE Name = 'Adventure')),
((SELECT Id FROM Movie WHERE Title = 'The Lord of the Rings: The Return of the King'), (SELECT Id FROM Genre WHERE Name = 'Drama')),
-- Película: The Lion King
((SELECT Id FROM Movie WHERE Title = 'The Lion King'), (SELECT Id FROM Genre WHERE Name = 'Animation')),
((SELECT Id FROM Movie WHERE Title = 'The Lion King'), (SELECT Id FROM Genre WHERE Name = 'Adventure')),
((SELECT Id FROM Movie WHERE Title = 'The Lion King'), (SELECT Id FROM Genre WHERE Name = 'Drama')),
-- Película: The Avengers
((SELECT Id FROM Movie WHERE Title = 'The Avengers'), (SELECT Id FROM Genre WHERE Name = 'Action')),
((SELECT Id FROM Movie WHERE Title = 'The Avengers'), (SELECT Id FROM Genre WHERE Name = 'Adventure')),
((SELECT Id FROM Movie WHERE Title = 'The Avengers'), (SELECT Id FROM Genre WHERE Name = 'Sci-Fi')),
-- Película: Jurassic Park
((SELECT Id FROM Movie WHERE Title = 'Jurassic Park'), (SELECT Id FROM Genre WHERE Name = 'Adventure')),
((SELECT Id FROM Movie WHERE Title = 'Jurassic Park'), (SELECT Id FROM Genre WHERE Name = 'Sci-Fi')),
-- Película: Titanic
((SELECT Id FROM Movie WHERE Title = 'Titanic'), (SELECT Id FROM Genre WHERE Name = 'Drama')),
((SELECT Id FROM Movie WHERE Title = 'Titanic'), (SELECT Id FROM Genre WHERE Name = 'Romance')),
-- Película: The Social Network
((SELECT Id FROM Movie WHERE Title = 'The Social Network'), (SELECT Id FROM Genre WHERE Name = 'Biography')),
((SELECT Id FROM Movie WHERE Title = 'The Social Network'), (SELECT Id FROM Genre WHERE Name = 'Drama')),
-- Película: Avatar
((SELECT Id FROM Movie WHERE Title = 'Avatar'), (SELECT Id FROM Genre WHERE Name = 'Action')),
((SELECT Id FROM Movie WHERE Title = 'Avatar'), (SELECT Id FROM Genre WHERE Name = 'Adventure')),
((SELECT Id FROM Movie WHERE Title = 'Avatar'), (SELECT Id FROM Genre WHERE Name = 'Fantasy'));


----- QUERY -----
SELECT * FROM Movie;
-- Movies by genre
SET @genre = NULL;
SELECT DISTINCT
	BIN_TO_UUID(M.Id, true) AS Id,
    M.Title,
    M.Year,
    M.Director,
    M.Duration,
    M.Poster,
    M.Rate
    -- G.Name AS Genre
FROM Movie AS M
LEFT JOIN MovieGenre AS MG ON M.Id = MG.MovieId
LEFT JOIN Genre AS G ON MG.GenreId = G.Id
WHERE CASE WHEN @genre IS NULL THEN true ELSE G.Name = @genre END = true
ORDER BY M.Title, M.Year;

SELECT *, BIN_TO_UUID(ID, true) FROM Movie WHERE Title = 'Sound Of Freedom';
-- DELETE FROM MovieGenre WHERE BIN_TO_UUID(MovieId, true) = '95fabcd3-6c58-11ee-8bef-509a4c43f702' AND GenreId IN(1,2);
-- DELETE FROM Movie WHERE Title = 'Sound Of Freedom';
SELECT * FROM MovieGenre WHERE BIN_TO_UUID(MovieId, true) = '46a5055a-6c72-11ee-8bef-509a4c43f702';