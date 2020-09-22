const { generateQuery, asyncQuery } = require("../helpers/queryHelp");

module.exports = {
  getAllProducts: async (req, res) => {
    const query =
      "select * from products p join product_img pi on p.id_product = pi.product_id";
    try {
      const result = await asyncQuery(query);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  getProductById: async (req, res) => {
    const id = parseInt(req.params.id);
    const query = `select * from products p
    join product_img pi on p.id_product = pi.product_id
    join categories c on p.product_cate=c.id_category
    where p.id_product=${id}`;
    try {
      const result = await asyncQuery(query);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  getProductPriceAsc: async (req, res) => {
    try {
      const query = `select * from products p
      join product_img pi on p.id_product = pi.product_id
      order by price_sell`;
      const result = await asyncQuery(query);

      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getProductPriceDesc: async (req, res) => {
    try {
      const query = `select * from products p
      join product_img pi on p.id_product = pi.product_id
      order by price_sell desc`;
      const result = await asyncQuery(query);

      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getProdCateLv2: async (req, res) => {
    const id = parseInt(req.params.id);
    const query = `select c1.id_category, c1.category, p.product_name, p.price_modal, p.price_sell, p.product_stock, pi.image 
    from categories c1 
    LEFT JOIN categories c2 ON c2.parent_id = c1.id_category
    left join products p on c2.id_category=p.product_cate 
    join product_img pi on p.id_product = pi.product_id
    WHERE c1.parent_id = 1 AND c1.id_category=${id}`;
    try {
      const result = await asyncQuery(query);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getProdCateLv3: async (req, res) => {
    const id = parseInt(req.params.id);
    const query = `select c1.id_category, c1.category, p.id_product, p.product_name, p.price_modal, p.price_sell, p.product_stock, pi.image 
    from categories c1 
    LEFT JOIN categories c2 ON c2.parent_id = c1.id_category
    left join products p on c1.id_category=p.product_cate 
    join product_img pi on p.id_product = pi.product_id
    WHERE c2.id_category IS NULL AND c1.id_category=${id}`;
    try {
      const result = await asyncQuery(query);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getAllPackages: async (req, res) => {
    const query = `SELECT p.id_product_package, p. package_name, p.description, p.img, 
    pd.category_id, pd.max_qty, 
      pr.id_product, pr.product_name, pr.price_modal, pr.product_stock, p.package_price
      FROM package p
      JOIN package_details pd ON p.id_product_package = pd.package_id
      LEFT JOIN products pr ON pd.category_id = pr.product_cate`;
    try {
      const result = await asyncQuery(query);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(5000).send(err);
    }
  },
  getPackageById: async (req, res) => {
    const id = parseInt(req.params.id);
    // const query = `SELECT p.id_product_package, p. package_name, p.description, p.img,
    //   pd.category_id, pd.max_qty,
    //   pr.id_product, pr.product_name, pr.price_modal, pr.product_stock, p.package_price
    //   FROM package p
    //   JOIN package_details pd ON p.id_product_package = pd.package_id
    //   LEFT JOIN products pr ON pd.category_id = pr.product_cate
    //   WHERE id_product_package = ${id}`;
    const query = `select p.id_product_package, p. package_name, p.description, p.img, pd.category_id, pd.max_qty, 
                   group_concat(pr.id_product separator',') as product_id, 
                   group_concat(pr.product_name separator',') as product_name, 
                   group_concat(pr.price_modal separator',') as price_modal, 
                   group_concat(pr.product_stock separator',') as product_stock
                   from package p
                   join package_details pd on p.id_product_package=pd.package_id
                   join categories c on pd.category_id=c.id_category
                   join products pr on c.id_category=pr.product_cate
                   where pd.package_id=${id} 
                   group by pd.category_id`;
    try {
      const result = await asyncQuery(query);
      result.forEach((item, index) => {
        item.product_id = item.product_id.split(',')
        item.product_name = item.product_name.split(',')
        item.price_modal = item.price_modal.split(',')
        item.product_stock = item.product_stock.split(',')
      });

      let tempRes = [...result]
      for (let i = 0; i < result.length; i++) {
        tempRes[i].product = []
        for (let j = 0; j < result[i].product_id.length; j++) {
          tempRes[i].product.push({ 
            product_id: result[i].product_id[j], 
            product_name: result[i].product_name[j],
            price_modal: result[i].price_modal[j],
            product_stock: result[i].product_stock[j],

           })
        }
        delete tempRes[i].product_id
        delete tempRes[i].product_name
        delete tempRes[i].price_modal
        delete tempRes[i].product_stock
      }
      

      res.status(200).send(tempRes);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  getAllProductPackage: async (req, res) => {
    try {
      const query = `SELECT * FROM package`;
      const result = await asyncQuery(query);

      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  getProductPackageDetailsById: async (req, res) => {
    try {
      const id_package = parseInt(req.params.id);
      const query = `SELECT pkg.id_product_package, pkg.package_name, pkg.package_price, pkg.img, pkg_d.category_id, pkg_d.max_qty
      FROM package pkg
      JOIN package_details pkg_d
      ON pkg.id_product_package = pkg_d.package_id
      WHERE pkg.id_product_package = ${id_package}`;
      const result = await asyncQuery(query);

      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
};
