const CryptoJS = require("crypto-js");
const { validationResult } = require("express-validator");
const { createToken } = require("../helpers/jwt");
const { generateQuery, asyncQuery } = require("../helpers/queryHelp");
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  getUserData: async (req, res) => {
    const getAllUsers = "SELECT * FROM users";
    try {
      const resultDataUsers = await asyncQuery(getAllUsers);
      res.status(200).send(resultDataUsers);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  register: async (req, res) => {
    console.log(`body : `, req.body);
    const { username, email, password, confpass } = req.body;
    try {
      //validate user input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array()[0].msg });
      }

      //check password
      if (password !== confpass) {
        return res.status(400).send(`Password doesn't match !`);
      }

      //insert new user to database
      const checkUser = `SELECT * FROM users WHERE username='${username}' or email='${email}'`;
      const resultCheckUser = await asyncQuery(checkUser);

      //check result
      if (resultCheckUser.length > 0) {
        return res.status(400).send("Username or Email is already used");
      }

      // encrypt password before insert into database
      const hashpass = CryptoJS.HmacMD5(password, SECRET_KEY);
      const insertUser = `INSERT INTO users (username, email, password, role, status)
                            values ('${username}', '${email}', '${hashpass.toString()}', 'user', 1)`;
      const resultQuery = await asyncQuery(insertUser);

      //prepare user's record data
      req.body.password = resultQuery;
      console.log(req.body.password)
      req.body.role = "user";
      req.body.status = 1;

      //add user record to database
      const addUser = `INSERT INTO users SET ?`;
      const newUser = await asyncQuery(addUser, req.body);

      //filter user's data
      delete req.body.password;
      req.body.id = newUser.insertId;

      //create token
      const token = createToken({ id: newUser.insertId, username });

      res.status(200).send({ ...req.body, token });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  login: async (req, res) => {
    const { username, password, email } = req.body;
    console.log(req.body);
    try {
      const getDataUsername = `SELECT * FROM users WHERE username = '${username}' or email = '${email}'`;
      const resultUsername = await asyncQuery(getDataUsername);

      //if username doesn't exist
      if (resultUsername.length === 0) {
        return res.status(400).send(`Username or Email not found`);
      }

      //check password: password from user vs password from database
      const hashpass = CryptoJS.HmacMD5(password, SECRET_KEY);
      if (hashpass.toString() !== resultUsername[0].password) {
        return res.status(400).send(`Invalid password!`);
      }

      //filter user's data
      delete resultUsername[0].password;

      //create token
      const token = createToken({
        id: resultUsername[0].id,
        username: resultUsername[0].username,
      });
      resultUsername[0].token = token;
      res.status(200).send(resultUsername[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  keeplogin: async (req, res) => {
    console.log(`user : `, req.user);
    try {
      //query to get user's data
      const queryKeepLogin = `SELECT user_id, username, email, role FROM users 
                            WHERE user_id=${req.user.id} AND username='${req.user.username}'`;
        const resultKeepLogin = await asyncQuery(queryKeepLogin);
        console.log("resultkeeplogin : ", resultKeepLogin);

        //prepare user's data
        delete resultKeepLogin[0].password;

        res.status(200).send(resultKeepLogin[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
