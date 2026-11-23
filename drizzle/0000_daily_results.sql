CREATE TABLE `daily_results` (
 `game_version` text NOT NULL,
 `day` text NOT NULL,
 `player` text NOT NULL,
 `attempts` integer NOT NULL CHECK (`attempts` BETWEEN 1 AND 3),
 `solved` integer NOT NULL CHECK (`solved` IN (0,1)),
 `correct` integer NOT NULL CHECK (`correct` BETWEEN 0 AND 5),
 `p0` integer NOT NULL CHECK (`p0` IN (0,1)),
 `p1` integer NOT NULL CHECK (`p1` IN (0,1)),
 `p2` integer NOT NULL CHECK (`p2` IN (0,1)),
 `p3` integer NOT NULL CHECK (`p3` IN (0,1)),
 `p4` integer NOT NULL CHECK (`p4` IN (0,1)),
 `created_at` integer NOT NULL,
 PRIMARY KEY (`game_version`, `day`, `player`)
);
