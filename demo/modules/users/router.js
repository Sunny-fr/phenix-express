const user = require('./controller')

const register = function (app, router) {

    // File upload middleware
    /** MIDDLEWARES **/

    router.route('/user/search')

    /********
     * Search
     *
     */
        .post(user.search)


    router.route('/user/:name')
    /********
     * Get one
     *
     */
        .get(user.get)

        /********
         * Update
         *
         */
        .put(user.update)

        /********
         * Delete
         *
         */
        .delete(user.delete)

    router.route('/user/')

    /********
     * Create
     *
     */
        .post(user.create)

        /********
         * Get all
         *
         */
        .get(user.getAll)
}

module.exports = {
    register: register
}