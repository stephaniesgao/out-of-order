CREATE TABLE `daily_sessions` (
 `game_version` text NOT NULL,
 `day` text NOT NULL,
 `player` text NOT NULL,
 `state` text NOT NULL,
 `revision` integer DEFAULT 0 NOT NULL,
 `updated_at` integer NOT NULL,
 PRIMARY KEY (`game_version`, `day`, `player`)
);
