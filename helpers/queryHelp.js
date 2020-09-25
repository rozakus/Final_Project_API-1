const util = require("util");
const db = require("../database");

module.exports = {
  queryCartPkg: (order_number, body, pkg_no) => {
    let res = "";
    for (let i = 0; i < body.product_id.length; i++) {
      res += `(${order_number}, ${body.package_id}, ${pkg_no}, ${body.product_id[i]}, ${body.product_qty[i]}, ${body.total_modal[i]}, ${body.total_sell}),`;
    }
    return res.slice(0, -1);
  },
  queryAddPkg: (packageId, details) => {
    let res = "";
    details.forEach((element) => {
      res += `(${packageId}, ${element.category_id}, ${element.max_qty}),`;
    });
    return res.slice(0, -1);
  },
  asyncQuery: util.promisify(db.query).bind(db),
};
