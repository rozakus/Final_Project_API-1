const { asyncQuery } = require("../helpers/queryHelp");

module.exports = {
  getAllProfile: async (req, res) => {
    try {
      const queryGetAllProfile = `select * from profile`;
      const resultQueryGetAllProfile = await asyncQuery(queryGetAllProfile);

      res.status(200).send(resultQueryGetAllProfile);
    } catch (error) {
      console.log(`error getAllProfile : `, error);
      res.status(500).send(error);
    }
  },
  uploadProfile: async (req, res) => {
    const id = parseInt(req.params.id)
    console.log('file : ', req.file)

    if (req.file === undefined) return res.status(400).send('no image.')

    try {
      const img = `UPDATE profile SET picture = 'profile/${req.file.filename}' WHERE user_id = ${id}`
      const result = await asyncQuery(img)

      res.status(200).send('uploaded')
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  },
  getProfileByID: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const queryGetProfileByID = `SELECT * FROM profile WHERE user_id = ${id}`;
      const resultGetProfileByID = await asyncQuery(queryGetProfileByID);

      res.status(200).send(resultGetProfileByID[0]);
    } catch (error) {
      console.log(`error getProfileByID : `, error);
      res.status(500).send(error);
    }
  },
};
