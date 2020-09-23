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
  getProfileByID: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const queryGetProfileByID = `SELECT * FROM profile WHERE id_profile = ${id}`;
      const resultGetProfileByID = await asyncQuery(queryGetProfileByID);

      res.status(200).send(resultGetProfileByID[0]);
    } catch (error) {
      console.log(`error getProfileByID : `, error);
      res.status(500).send(error);
    }
  },
};
