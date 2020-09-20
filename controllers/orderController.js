const { asyncQuery, queryCartPkg } = require("../helpers/queryHelp");

// export controller
module.exports = {
  addToCartPcs: async (req, res) => {
    try {
      // define
      const { user_id, product_id, product_qty, total } = req.body;
      let order_number = 0;
      console.log(req.body);

      // check order number from user id
      const queryCheck = `SELECT * FROM orders WHERE user_id = ${user_id} AND status = 1`;
      const resultCheck = await asyncQuery(queryCheck);

      // belom ada order number, generate
      if (resultCheck[0] === undefined) {
        console.log("generate number");

        // generate new order number
        order_number = Date.now();

        // insert to order
        const insertOrders = `INSERT INTO orders (order_number, user_id, status)
                values (${order_number}, ${user_id}, 1)`;
        const resultOrders = await asyncQuery(insertOrders);

        // insert to order detail
        const insertOrderDetail = `INSERT INTO orders_detail (order_number, product_id, product_qty, total)
                values (${order_number}, ${product_id}, ${product_qty}, ${total})`;
        const resultOrderDetail = await asyncQuery(insertOrderDetail);
      }

      // udah ada order number
      if ((resultCheck[0] = true)) {
        console.log("ada order number");
        // get order number from mysql
        order_number = resultCheck[0].order_number;

        // check product yg dibeli ada atau gak (di order details)
        const checkProductDetails = `SELECT * from orders_detail
                WHERE order_number = ${order_number} AND product_id = ${product_id}`;
        const resultProductDetails = await asyncQuery(checkProductDetails);

        // belom ada product id yg dipilih
        if (resultProductDetails[0] === undefined) {
          // insert product
          const insertProduct = `INSERT INTO orders_detail (order_number, product_id, product_qty, total)
                    values (${order_number}, ${product_id}, ${product_qty}, ${total})`;
          const resultInsert = await asyncQuery(insertProduct);
          console.log(resultInsert);
        }

        // udah ada product, update
        if ((resultProductDetails[0] = true)) {
          // jumlah qty baru + qty di chart
          const qtyUpdated = resultCheck[0].product_qty + product_qty;

          // update product
          const updateOrderDetail = `UPDATE orders_detail SET product_qty=${qtyUpdated}
                    WHERE product_id =${product_id} AND order_number = ${order_number}`;
          const resultUpdate = await asyncQuery(updateOrderDetail);
          console.log(resultUpdate);
        }
      }

      res.status(200).send("sukses brok");
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  addToCartPkg: async (req, res) => {
    try {
      // define
      const { user_id, package_id, product_id } = req.body;
      let order_number;
      console.log(req.body);

      // check order number from user id
      const queryCheck = `SELECT * FROM orders WHERE user_id = ${user_id} AND status = 1`;
      const resultCheck = await asyncQuery(queryCheck);

      // belom ada order number, generate
      if (resultCheck[0] === undefined) {
        console.log("generate number");

        // generate new order number
        order_number = Date.now();

        // insert to order
        const insertOrders = `INSERT INTO orders (order_number, user_id, status)
                values (${order_number}, ${user_id}, 1)`;
        const resultOrders = await asyncQuery(insertOrders);

        // insert to order detail
        const pkg_no = 1;
        const insertOrderDetail =
          `INSERT INTO orders_detail (order_number, package_id, package_no, product_id, product_qty, total) ` +
          queryCartPkg(order_number, req.body, pkg_no);
        const resultOrderDetail = await asyncQuery(insertOrderDetail);
      }

      // udah ada order number
      if ((resultCheck[0] = true)) {
        console.log("ada order number");
        // get order number from mysql
        order_number = resultCheck[0].order_number;

        // check package yg dibeli ada atau gak (di order details)
        const checkPackageDetails = `SELECT * from orders_detail
                WHERE order_number = ${order_number} AND package_id = ${package_id}`;
        const resultPackageDetails = await asyncQuery(checkPackageDetails);

        // belom ada package id yg dipilih
        if (resultPackageDetails[0] === undefined) {
          // insert product
          const pkg_no = 1;
          const insertOrderDetail =
            `INSERT INTO orders_detail (order_number, package_id, package_no, product_id, product_qty, total) ` +
            queryCartPkg(order_number, req.body, pkg_no);
          const resultInsert = await asyncQuery(insertOrderDetail);
          console.log(resultInsert);
        }

        // udah ada package, tambah no package nya
        if ((resultProductDetails[0] = true)) {
          // package no tambah 1
          const pkgNoUpd =
            resultProductDetails[resultProductDetails.length - 1].package_no +
            1;
          // insert order detail dengan package yg sama tapi beda nomor
          const insertProduct =
            `INSERT INTO orders_detail (order_number, package_id, package_no, product_id, product_qty, total) ` +
            queryCartPkg(order_number, req.body, pkgNoUpd);
          const resultInsert = await asyncQuery(insertProduct);

          res.status(200).send("sukses brok");
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
