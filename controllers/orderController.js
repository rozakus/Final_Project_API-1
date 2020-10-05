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
    const { users_id, order_number, payment_type, amount } = req.params

    console.log('file : ', req.params)
    console.log('file : ', req.file)

    if (req.file === undefined) return res.status(400).send('no image.')

    try {
      const queryPayment = `insert into payment (users_id, order_number, payment_type_id, amount, payment_status_id) 
          values (${parseInt(users_id)}, ${parseInt(order_number)}, ${parseInt(payment_type)}, ${parseInt(amount)}, 1)`;
      const resPayment = await asyncQuery(queryPayment);
      console.log('payment : ', queryPayment)

      const img = `UPDATE payment SET transaction_receipt = 'payment/${req.file.filename}' WHERE order_number = ${parseInt(order_number)}`
      const result = await asyncQuery(img)
      console.log('transaction receipt : ', img)

      const queryApproval = `UPDATE orders SET status = 3 WHERE order_number = ${parseInt(order_number)}`
      console.log('approval : ', queryApproval)
      const resApproval = await asyncQuery(queryApproval);

      res.status(200).send("berhasil");
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  paymentUpload: async (req, res) => {
    console.log('file : ', req.file)
    const { order_number } = req.params
    console.log('body', req.params)

    if (req.file === undefined) return res.status(400).send('no image.')

    try {
      const img = `UPDATE payment SET transaction_receipt = 'payment/${req.file.filename}' WHERE order_number = ${parseInt(order_number)}`
      const result = await asyncQuery(img)

      res.status(200).send('uploaded')
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
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
  },
  reduceStock: async (req, res) => {
    const { order_number } = req.body
    console.log(req.body)
    try {
      const paidOderNumber = `SELECT od.product_id, od.product_qty
      FROM orders o
      JOIN orders_detail od ON o.order_number = od.order_number
      WHERE o.order_number = ${order_number} AND o.status = 4`
      const resultPaid = await asyncQuery(paidOderNumber)

      const queryReduce1 = `
      UPDATE products SET product_stock = 80 WHERE id_product = 2
      UPDATE products SET product_stock = 90 WHERE id_product = 3`

      const queryReduce2 = `
      UPDATE students s
      JOIN (
        SELECT 1 as id, 5 as new_score1, 8 as new_score2
        UNION ALL
        SELECT 2, 10, 8
        UNION ALL
        SELECT 3, 8, 3
        UNION ALL
        SELECT 4, 10, 7
        ) vals ON s.id = vals.id
      SET score1 = new_score1, score2 = new_score2`

      const queryReduce3 = `
      INSERT INTO students (id, score1, score2)
      VALUES 
        (1, 5, 8),
        (2, 10, 8),
        (3, 8, 3),
        (4, 10, 7)
      ON DUPLICATE KEY UPDATE 
        score1 = VALUES(score1),
        score2 = VALUES(score2)`

      res.status(200).send(resultPaid)
    } catch (err) {
      res.status(400).send(err)
    }
  }
};
