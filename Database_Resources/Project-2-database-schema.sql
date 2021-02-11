CREATE TABLE NHL_Home_Games (
	Team VARCHAR(30),
	GP INT,
	W INT,
	L INT,
	Tie INT,
	OT INT,
	Points INT,
	W_PCT DEC
);

SELECT * FROM NHL_Home_Games;


CREATE TABLE NHL_Arenas (
	Arena_Name VARCHAR(50),
	Team VARCHAR(30),
	Latitude DEC,
	Longitude DEC
);

SELECT * FROM NHL_Arenas;

CREATE TABLE MLB_Stadiums (
	Stadium_Name VARCHAR(30),
	Latitude DEC,
	Longitude DEC,
	Team VARCHAR(30)
);

SELECT * FROM MLB_Stadiums;

CREATE TABLE NFL_Stadiums (
	Stadium_Name VARCHAR(40),
	Team VARCHAR(40),
	Latitude DEC,
	Longitude DEC
);

SELECT * FROM NFL_Stadiums;

CREATE TABLE NFL_Home_Wins (
	Team VARCHAR(40),
	GP INT,
	W INT,
	L INT,
	Tie INT,
	W_PCT DEC
);

SELECT * FROM NFL_Home_Wins;

CREATE TABLE MLB_Home_Wins (
	Team VARCHAR(40),
	GP INT,
	W INT,
	L INT,
	Tie INT,
	W_PCT DEC
);

SELECT * FROM MLB_Home_Wins;
