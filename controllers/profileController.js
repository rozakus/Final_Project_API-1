const { asyncQuery } = require('../helpers/queryHelp');

module.exports = {
    getProfile : async (req, res) => {
        const id_profile = parseInt(req.params.id)
        try {
            const queryGetProfile = `SELECT * FROM profile WHERE id_profile = ${id_profile}`
            const resultGetProfile = await asyncQuery(queryGetProfile)

            res.status(200).send(resultGetProfile[0])
        } catch (error) {
            console.log(`error getProfile : `, error)
            res.status(500).send(error)
        }
    }
}