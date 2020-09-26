const { asyncQuery } = require("../helpers/queryHelp");

module.exports = {
  checkOut: async (req, res) => {
    const checkoutquery = `UPDATE orders SET status = 2 WHERE order_number = ${parseInt(req.params.on)}`;
    try {
      const result = await asyncQuery(checkoutquery);

      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  payment: async (req, res) => {
    const { users_id, order_number, payment_type, amount } = req.body;
    try {
      const queryPayment = `insert into payment (users_id, order_number, payment_type_id, amount, payment_status_id) 
          values (${users_id}, ${order_number}, ${payment_type}, ${amount}, 1)`;
      const resPayment = await asyncQuery(queryPayment);

      const queryApproval = `UPDATE orders SET status = 3 WHERE order_number = ${order_number}`;
      const resApproval = await asyncQuery(queryApproval);

      res.status(200).send("ok");
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  paymentMethod: async (req, res) => {
    try {
      const query = `SELECT * FROM payment_type`
      const resultQuery = await asyncQuery(query)

      res.status(200).send(resultQuery)
    } catch (err) {
      res.status(400).send(err)
    }
  }
};
