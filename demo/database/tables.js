module.exports = {
    users: `
    CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
      \`firstName\` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
      \`lastName\` varchar(255) COLLATE utf8_bin NOT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
    `
}
