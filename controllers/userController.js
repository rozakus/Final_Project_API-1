const CryptoJS = require("crypto-js");
const { validationResult } = require("express-validator");
const { createToken } = require("../helpers/jwt");
const { generateQuery, asyncQuery } = require("../helpers/queryHelp");
const SECRET_KEY = process.env.SECRET_KEY;
const transporter = require("../helpers/nodemailer");

module.exports = {
  getUserData: async (req, res) => {
    const getAllUsers = "SELECT * FROM users u join profile p on u.id_users = p.user_id";
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
        return res.status(422).send(errors.array()[0].msg);
      }

      //check password
      if (password !== confpass) {
        return res
          .status(400)
          .send(`Password and Confirm Password doesn't match!`);
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
      const query = `INSERT INTO users (username, email, password, role, status)
                     values ('${username}', '${email}', '${hashpass.toString()}', 'user', 1)`;
      const result = await asyncQuery(query);

      // insert to profile
      const queryProfile = `insert into profile (user_id) values(${result.insertId})`
      const resultProfile = await asyncQuery(queryProfile)

      //create token
      const token = createToken({ id: result.insertId });
      
      //prepare user's record data
      req.body.id = result.insertId;
      req.body.role = "user";
      req.body.status = 1;
      req.body.token = token
      delete req.body.password;
      delete req.body.confpass;

      // sent email verification to user
      const option = {
        from: `admin <frengky.sihombing.777@gmail.com>`,
        to: `${email}`,
        subject: "PurwaHampers Verification",
        text: `Hello our precious customers, ${username}!
        
        Click link below to verified your account
        
        Your hamper's best provider,
        PurwaHampers.`,
        html: `
            <a href ="http://127.0.0.2:2000/verification/${token}">http://127.0.0.2:2000/verification/${token}</a>`,
      };
      const info = await transporter.sendMail(option);
      console.log(req.body)

      res.status(200).send(req.body);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  login: async (req, res) => {
    const { identity, password } = req.body;
    console.log(req.body);
    try {
      const getDataUsername = `SELECT * FROM users u
                                 join profile p on u.id_users = p.user_id
                                WHERE username = '${identity}' or email = '${identity}'`;
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
        id: resultUsername[0].id_users
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
      const queryKeepLogin = `SELECT * FROM users u join profile p on u.id_users = p.user_id where u.id_users = ${req.user.id}`;
      const resultKeepLogin = await asyncQuery(queryKeepLogin);

      //prepare user's data
      delete resultKeepLogin[0].password;

      res.status(200).send(resultKeepLogin[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  emailVerification: async (req, res) => {
    try {
      // change status user in database
      const qUpdateStatus = `UPDATE users SET status = 2 WHERE id_users = ${req.user.id}`;
      const updateStatus = await asyncQuery(qUpdateStatus);

      const getUser = `select * from users u
                       join profile p on u.id_users = p.user_id where id_users = ${req.user.id}`
      const result = await asyncQuery(getUser)

      delete result[0].password

      res.status(200).send(`Congratulations! Your account has been verified`);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
