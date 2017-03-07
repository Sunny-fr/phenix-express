const concept = require('./controller')

const register = function (app, router) {

    // File upload middleware
    /** MIDDLEWARES **/

    router.route('/concept/search')

    /********
     * Search
     *
     */
        .post(concept.search)


    router.route('/concept/:name')
    /********
     * Get one
     *
     */
        .get(concept.get)

        /********
         * Update
         *
         */
        .put(concept.update)

        /********
         * Delete
         *
         */
        .delete(concept.delete)

    router.route('/concept/')

    /********
     * Create
     *
     */
        .post(concept.create)

        /********
         * Get all
         *
         */
        .get(concept.getAll)
}

module.exports = {
    register: register
}