module.exports = {
    concepts: "CREATE TABLE `concepts` ( `id` int(11) unsigned NOT NULL AUTO_INCREMENT, `name` varchar(255) COLLATE utf8_bin DEFAULT NULL UNIQUE, `description` blob, `type` varchar(255) COLLATE utf8_bin DEFAULT NULL, `namespace` varchar(255) COLLATE utf8_bin DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;",
    conceptLinks: "CREATE TABLE `concepts_links` ( `concept_id` int(11) unsigned NOT NULL, `name` varchar(255) COLLATE utf8_bin DEFAULT NULL, `url` varchar(255) COLLATE utf8_bin DEFAULT NULL, PRIMARY KEY (`concept_id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;",
    conceptSymbols: "CREATE TABLE `concepts_symbols` (`concept_id` int(11) unsigned NOT NULL, `label` varchar(255) COLLATE utf8_bin DEFAULT NULL, PRIMARY KEY (`concept_id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;"
}
