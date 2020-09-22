const { asyncQuery } = require('../helpers/queryHelp');

module.exports = {
    getProfile: async (req, res) => {
        const id_profile = parseInt(req.params.id)
        try {
            const queryGetProfile = `SELECT * FROM profile WHERE id_profile = ${id_profile}`
            const resultGetProfile = await asyncQuery(queryGetProfile)

            res.status(200).send(resultGetProfile[0])
        } catch (error) {
            console.log(`error getProfile : `, error)
            res.status(500).send(error)
        }
    },
    uploadProfile: async (req, res) => {
        const id = parseInt(req.params.id)
        console.log('file : ', req.file)

        if (req.file === undefined) return res.status(400).send('no image.')

        try {
            const img = `UPDATE profile SET picture = 'images/${req.file.filename}' WHERE user_id = ${id}`
            const result = await asyncQuery(img)

            res.status(200).send('uploaded')
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}