const util = require("util");
const db = require("../database");

module.exports = {
  queryCartPkg: (order_number, body, pkg_no) => {
    let res = "";
    for (let i = 0; i < body.product_id.length; i++) {
      res += `values (${order_number}, ${body.package_id}, ${pkg_no}, ${body.product_id[i]}, ${body.product_qty[i]}, ${body.total[i]}),`;
    }
    return res.slice(0, -1);
  },
  asyncQuery: util.promisify(db.query).bind(db),
};
