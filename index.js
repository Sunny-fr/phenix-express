module.exports = {
    server: require('./src/server'),
    Collection: require('./src/framework/collection/Collection'),
    MariaCollection: require('./src/framework/collection/MariaCollection'),
    Model: require('./src/framework/model/Model'),
    MariaModel: require('./src/framework/model/MariaModel'),
    MariaQueryBuilder: require('./src/framework/query/MariaQueryBuilder')
}