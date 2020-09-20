const { asyncQuery, queryCartPkg } = require("../helpers/queryHelp");

// export controller
module.exports = {
  getCart: async (req, res) => {
    const id = parseInt(req.params.id)
    try {
      const query = `select o.order_number, o.user_id, o.status, od.package_id, od.package_no, od.product_id, od.product_qty, od.total, p.package_name, p.package_price 
      from orders o
      join orders_detail od on o.order_number=od.order_number
      left join package p on od.package_id=p.id_product_package
      where o.user_id=${id} and o.status=1`
      const res = await asyncQuery(query)

      res.status(200).send(res)
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  },
  addToCartPcs: async (req, res) => {
    try {
      // define
      const { user_id, product_id, product_qty, total } = req.body;
      
      // check order number from user id
      const queryCheck = `SELECT * FROM orders WHERE user_id = ${user_id} AND status = 1`;
      const resultCheck = await asyncQuery(queryCheck);
      let order_number = resultCheck[0] ? resultCheck[0].order_number : Date.now();

      // belom ada order number, generate
      if (resultCheck[0] === undefined) {
        console.log('belum ada order number')

        // insert to order
        const insertOrders = `INSERT INTO orders (order_number, user_id, status)
                values (${order_number}, ${user_id}, 1)`;
        const resultOrders = await asyncQuery(insertOrders);

        // insert to order detail
        const insertOrderDetail = `INSERT INTO orders_detail (order_number, product_id, product_qty, total)
                values (${order_number}, ${product_id}, ${product_qty}, ${total})`;
        const resultOrderDetail = await asyncQuery(insertOrderDetail);
        return res.status(200).send("sukses brok");
      }

      // udah ada order number
      if ((resultCheck[0] = true)) {
        console.log("sudah ada order number");

        // check product yg dibeli ada atau gak (di order details)
        const checkProductDetails = `SELECT * from orders_detail WHERE order_number = ${order_number} AND product_id = ${product_id}`;
        const resultProductDetails = await asyncQuery(checkProductDetails);
        const pq = resultProductDetails[0] ? resultProductDetails[0].product_qty : 0
        const to = resultProductDetails[0] ? resultProductDetails[0].total : 0

        // belom ada product id yg dipilih
        if (resultProductDetails[0] === undefined) {
          // insert product
          const insertProduct = `INSERT INTO orders_detail (order_number, product_id, product_qty, total)
                    values (${order_number}, ${product_id}, ${product_qty}, ${total})`;
          const resultInsert = await asyncQuery(insertProduct);
          return res.status(200).send("sukses brok");
        }

        // udah ada product, update
        if ((resultProductDetails[0] = true)) {
          // jumlah qty baru + qty di chart
          const qtyUpdated = pq + product_qty
          const totalUpdate = to + total;

          // update product
          const updateOrderDetail = `UPDATE orders_detail SET product_qty=${qtyUpdated}, total=${totalUpdate} 
          WHERE product_id =${product_id} AND order_number = ${order_number}`;
          const resultUpdate = await asyncQuery(updateOrderDetail);
          return res.status(200).send("sukses brok");
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  addToCartPkg: async (req, res) => {
    try {
      // define
      const { user_id, package_id } = req.body;
      console.log(req.body);
      
      // check order number from user id
      const queryCheck = `SELECT * FROM orders WHERE user_id = ${user_id} AND status = 1`;
      const resultCheck = await asyncQuery(queryCheck);
      let order_number = resultCheck[0] ? resultCheck[0].order_number : Date.now();

      // belom ada order number, generate
      if (resultCheck[0] === undefined) {
        console.log("generate number");

        // insert to order
        const insertOrders = `INSERT INTO orders (order_number, user_id, status)
                values (${order_number}, ${user_id}, 1)`;
        const resultOrders = await asyncQuery(insertOrders);

        // insert to order detail
        const pkg_no = 1;
        const insertOrderDetail =
          `INSERT INTO orders_detail (order_number, package_id, package_no, product_id, product_qty, total) values ` +
          queryCartPkg(order_number, req.body, pkg_no);
        const resultOrderDetail = await asyncQuery(insertOrderDetail);

        return res.status(200).send("sukses brok");
      }

      // udah ada order number
      if ((resultCheck[0] = true)) {
        console.log("ada order number");

        // check package yg dibeli ada atau gak (di order details)
        const checkPackageDetails = `SELECT * from orders_detail
                WHERE order_number = ${order_number} AND package_id = ${package_id}`;
        const resultPackageDetails = await asyncQuery(checkPackageDetails);
        console.log(resultPackageDetails)

        // belom ada package id yg dipilih
        if (resultPackageDetails.length === 0) {
          // insert product
          const pkg_no = 1;
          const insertOrderDetail =
            `INSERT INTO orders_detail (order_number, package_id, package_no, product_id, product_qty, total) values ` +
            queryCartPkg(order_number, req.body, pkg_no);
          const resultInsert = await asyncQuery(insertOrderDetail);

          return res.status(200).send("sukses brok");
        }

        // udah ada package, tambah no package nya
        if (resultPackageDetails.length > 0) {
          // package no tambah 1
          const pkgNoUpd =
          resultPackageDetails[resultPackageDetails.length - 1].package_no +
            1;
          // insert order detail dengan package yg sama tapi beda nomor
          const insertProduct =
            `INSERT INTO orders_detail (order_number, package_id, package_no, product_id, product_qty, total) values ` +
            queryCartPkg(order_number, req.body, pkgNoUpd);
          const resultInsert = await asyncQuery(insertProduct);
          
          return res.status(200).send("sukses brok");
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  editQtyPcs: async (req, res) => {
    const { qty, total, product_id, order_number } = req.body
    try {
        const query = `update orders_detail SET product_qty=${qty}, total=${total} 
        WHERE product_id =${product_id} AND order_number = ${order_number}`
        const res = await asyncQuery(query)

        res.status(200).send(res)
      
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  },
  deletePcs: async (req, res) => {
    const { order_number, product_id} =req.body
    try {
      const query = `delete from orders_detail where order_number=${order_number} and product_id=${product_id}`
      const res = await asyncQuery(query)

      res.status(200).send(res)
    } catch(err) {
      console.log(err)
      res.status(500).send(err)
    }
  },
  deletePkg: async (req, res) => {
    const { order_number, package_id, package_no } = req.body
    try {
      const query = `delete from orders_detail 
      where order_number=${order_number} and package_id=${package_id} and package_no=${package_no}`
      const res = await asyncQuery(query)

      res.status(200).send(res)
    } catch(err) {
      console.log(err)
      res.status(500).send(err)
    }
  }
};
