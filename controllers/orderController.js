// import
const { asyncQuery, generateQuery } = require('../helpers/queryHelp')

// export controller
module.exports = {
    order: async (req, res) => {
        try {
            // define
            const { user_id, package_id, product_id, qty } = req.body
            let order_number = 0
            console.log(req.body)

            // check order number from user id
            const queryCheck = `SELECT * FROM orders WHERE user_id = ${user_id} AND status = 1`
            const resultCheck = await asyncQuery(queryCheck)

            // belom ada order number, generate
            if (resultCheck[0] === undefined) {
                console.log('generate number')

                // generatate new order number
                order_number = Date.now()

                // insert order to tabel
                const insertOrders = `INSERT INTO orders (order_number, user_id, status)
                values (${order_number}, ${user_id}, 1)`
                const resultOrders = await asyncQuery(insertOrders)

                // check query sama hasil
                console.log(insertOrders)
                console.log(resultOrders)

                // insert order detail
                const insertOrderDetail = `INSERT INTO orders_detail (order_number, package_id, product_id, qty, total)
                values (${order_number}, ${package_id}, ${product_id}, ${qty}, 100000)`
                const resultOrderDetail = await asyncQuery(insertOrderDetail)

                // check query sama hasil
                console.log(insertOrderDetail)
                console.log(resultOrderDetail)

                res.status(200).send(resultOrderDetail)

            } else { // udah ada order number

                console.log('ada order number')
                // get order number from mysql
                order_number = resultCheck[0].order_number

                // check product yg dibeli ada atau gak (di order details)
                const checkProductDetails = `SELECT * from orders_detail
                WHERE order_number = ${order_number} AND product_id = ${product_id}`
                const resultProductDetails = await asyncQuery(checkProductDetails)

                // belom ada product id yg dipilih
                if (resultProductDetails[0] === undefined) {
                    // insert product
                    const insertProduct = `INSERT INTO orders_detail (order_number, package_id, product_id, qty, total)
                    values (${order_number}, ${package_id}, ${product_id}, ${qty}, 100000)`
                    const resultInsert = await asyncQuery(insertProduct)

                    // check query sama hasil
                    console.log(insertProduct)
                    console.log(resultInsert)

                    res.status(200).send(resultInsert)

                } else { // udah ada product id, update

                    // jumlah qty baru + qty di chart
                    const qtyUpdated = qty + resultProductDetails[0].qty // updated qty
                    console.log('result qty : ', resultProductDetails[0].qty) // old qty
                    console.log('qty updated : ', qtyUpdated) // updated qty 

                    // update product
                    const updateOrderDetail = `UPDATE orders_detail SET qty=${qtyUpdated}
                    WHERE order_number=${order_number} AND product_id =${product_id} AND package_id IS NULL`
                    const resultUpdate = await asyncQuery(updateOrderDetail)

                    // check query sama hasil
                    console.log(updateOrderDetail)
                    console.log(resultUpdate)

                    res.status(200).send(resultUpdate)
                }
            }
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}