const { generateQuery, asyncQuery } = require("../helpers/queryHelp");
// rozak
module.exports = {
  getAllProducts: async (req, res) => {
    const query = "SELECT * FROM products";
    try {
      const result = await asyncQuery(query);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  getDetailProduct: async (req, res) => {
      const { id } = req.params
      const query = `SELECT * FROM products WHERE id_product = ${id}`
      try {
          const result = await asyncQuery(query)
          res.status(200).send(result)
      } catch (err) {
          console.log(err)
          res.status(500).send(err)
      }
  },
  getAllPackages: async (req, res) => {
      const query = `select * from package p
      join package_details pd on p.id_product_package = pd.package_id`
      try {
          const result = await asyncQuery(query)
          res.status(200).send(result)
      } catch(err) {
          console.log(err)
          res.status(500).send(err)
      }
  },
  getDetailPackage: async (req, res) => {
      const { id } = req.params
      const query = `SELECT p.id_product_package, p. package_name, p.description, 
      pd.category_id, pd.max_qty, 
      pr.id_product, pr.product_name, pr.price_modal, pr.product_stock, p.package_price
      FROM package p
      JOIN package_details pd ON p.id_product_package = pd.package_id
      LEFT JOIN products pr ON pd.category_id = pr.product_cate
      WHERE id_product_package = ${id}`
      try {
          const result = await asyncQuery(query)
          res.status(200).send(result)
      } catch(err) {
          console.log(err)
          res.status(500).send(err)
      }
  }
};
