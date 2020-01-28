const UserModel = require('./models/UserModel')
const UserCollection = require('./collections/UserCollection')

/**
 * Will create a concept
 * @param req
 * @param res
 */
exports.create = function (req, res) {


    console.log(req.body)
    if (!req.body.name || !req.body.description) {
        const message = 'No name or description provided'
        res.status(400).json({message});
        return;
    }

    const conceptModel = new UserModel(req.body)
    conceptModel.save()
        .then(() => {
            res.status(201).json(conceptModel.toJSON())
        })
        .catch(error => {
            res.status(500).json({message: error});
        })
};


/**
 * Will search a list concept
 * @param req
 * @param res
 */
exports.search = function (req, res) {

    if (!req.body.firstName) {
        const message = 'No Search Term provided'
        res.status(400).json({message});
        return;
    }
    const collection = new UserCollection()
    collection.find({'firstName': req.body.firstName})
        .then(() => {
            res.status(201).json(collection.toJSON())
        })
        .catch(error => {
            res.status(500).json({error});
        })
};

/**
 * Will list all concepts in db
 * @param req
 * @param res
 */
exports.getAll = function (req, res) {


    const collection = new UserCollection()
    collection.fetch()
        .then(() => {
            res.status(200).json(collection.toJSON())
        })
        .catch(error => {
            res.status(500).json({error});
        })
};


/**
 * Will retrieve one record
 * @param req
 * @param res
 */
exports.get = function (req, res) {

    const name = req.params.name

    if (!name) {
        const message = 'No name provided'
        res.status(400).json({message});
        return;
    }

    const conceptModel = new UserModel({name})
    conceptModel.fetch()
        .then(() => {
            res.status(201).json(conceptModel.toJSON())
        })
        .catch(error => {
            conceptModel.log(error)
            const message = "Not Found"
            res.status(404).json({message});
        })

};


/**
 * Will update one record
 * @param req
 * @param res
 */
exports.update = function (req, res) {

    const name = req.params.name

    if (!name) {
        const message = 'No id provided'
        res.status(400).json({message});
        return;
    }

    const conceptModel = new UserModel({name})
    conceptModel
        .fetch()
        .then(() => {
            conceptModel.set(req.body)
            return conceptModel.save()
        })
        .then(()=> {
            res.status(200).json(conceptModel.toJSON())
        })
        .catch(error => {
            conceptModel.log(error)
            const message = "Not Found"
            res.status(404).json({message});
        })

};

/**
 * Will list all concepts in db
 * @param req
 * @param res
 */
exports.delete = function (req, res) {

    const name = req.params.name

    if (!name) {
        const message = 'No name provided'
        res.status(400).json({message});
        return;
    }

    const conceptModel = new UserModel({name})
    conceptModel.fetch()
        .then(() => {
            conceptModel
                .destroy()
                .then(()=> {
                    const message = "Removed"
                    res.status(200).json({message})
                })
                .catch((err)=> {
                    conceptModel.log(err)
                    const message = "Error Happened"
                    res.status(500).json({message})
                })
        })
        .catch(error => {
            conceptModel.log(error)
            const message = "Not Found"
            res.status(404).json({message});
        })

};


