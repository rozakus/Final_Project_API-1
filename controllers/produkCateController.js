const { generateQuery, asyncQuery } = require("../helpers/queryHelp");

module.exports = {
    getLv2Cate: async (req, res) => {
        const query = `select * from categories where parent_id = 1`
        try {
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    getLv3Cate: async (req, res) => {
        const query = `SELECT c1.id_category, c1.category FROM categories c1
        LEFT JOIN categories c2 ON c2.parent_id = c1.id_category
        WHERE c2.id_category IS NULL`
        try {
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    getProductByLv2Cate: async (req, res) => {
        const { id } = req.params
        const query = `SELECT c1.id_category, c1.category, c2.id_category, c2.category, p.id_product, p.product_name, p.price_sell, p.product_stock
        FROM categories c1
        LEFT JOIN categories c2 ON c2.parent_id = c1.id_category
        left join products p on c2.id_category = p.product_cate
        where c1.parent_id = 1 and c1.id_category = ${id}`
        try {
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch(err) {
            res.status(500).send(err)
        }
    },
    getProductByLv3Cate: async (req, res) => {
        const { id } = req.params
        const query = `SELECT c1.id_category, c1.category, c2.id_category, c2.category, p.id_product, p.product_name, p.price_sell, p.product_stock
        FROM categories c1
        LEFT JOIN categories c2 ON c2.parent_id = c1.id_category
        left join products p on c2.id_category = p.product_cate
        where c1.parent_id = 1 and c2.id_category = ${id}`
        try {
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch(err) {
            res.status(500).send(err)
        }
    }
}