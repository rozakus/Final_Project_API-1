const {asyncQuery} = require('../helpers/queryHelp')

module.exports = {
    salesReport: async (req, res) => {
        try {
            const query = `select o.user_id, u.username, o.order_number, os.status, sum(od.total_modal) as total_modal, p.amount as total_sell 
            from orders o
            join orders_detail od on o.order_number=od.order_number
            join payment p on o.order_number=p.order_number
            join users u on o.user_id=u.id_users
            join orders_status os on o.status=os.id_orders_status
            where o.status = 4
            group by o.order_number`
            const result = await asyncQuery(query)
            
            result.forEach(element => {
                element.profit = element.total_sell - element.total_modal
            });

            res.status(200).send(result)
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    salesRepPkg: async (req, res) => {
        try {
            const query = `select o.order_number, o.user_id, u.username, od.package_id, p.package_name, sum(od.total_modal) as total_modal, p.package_price, concat(o.order_number, od.package_id ,od.package_no) as package 
            from orders o
            join orders_detail od on o.order_number=od.order_number
            join package p on od.package_id=p.id_product_package
            join users u on o.user_id=u.id_users
            where o.status = 4 and od.package_id is not null
            group by package`
            const result = await asyncQuery(query)

            result.forEach(element => {
                delete element.package
                element.profit = element.package_price - element.total_modal
            });

            res.status(200).send(result)
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    approvalPayment: async (req, res) => {
        try {
            const queryPayment = `update payment set payment_status_id=2
                           where order_number=${parseInt(req.params.on)}`
            const resultPayment = await asyncQuery(queryPayment)
            console.log(queryPayment)
            
            console.log(req.params.on)
            const queryOrders = `update orders set status=4 where order_number=${parseInt(req.params.on)}`
            const resultOrders = await asyncQuery(queryOrders)
            console.log(queryOrders)

            res.status(200).send(resultOrders)
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    cancelPayment: async (req, res) => {
        try {
            const queryPayment = `update payment set payment_status_id=3
                           where order_number=${parseInt(req.params.on)}`
            const resultPayment = await asyncQuery(queryPayment)

            const queryOrders = `update orders set status=5 where order_number=${parseInt(req.params.on)}`
            const resultOrders = await asyncQuery(queryOrders)

            res.status(200).send(resultOrders)
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    transHistory: async (req, res) => {
        try {
            const query = `select p.users_id, p.order_number, p.payment_date, pt.via_bank, p.amount, p.transaction_receipt, p.payment_status_id, ps.status 
            from payment p
            join payment_type pt on p.payment_type_id=pt.id_payment_type
            join payment_status ps on p.payment_status_id=ps.id_payment_status`
            const result = await asyncQuery(query)

            res.status(200).send(result)
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    reStock: async (req, res) => {
        const {restock, id_product} = req.body
        try {
            const query = `update from products set product_stock=${restock}
                           where id_product=${id_product}`
            const result = await asyncQuery(query)

            res.status(200).send(result)
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    TotalSalesReport: async (req, res) => {
        try {
            const query = `select o.user_id, u.username, o.order_number, os.status, sum(od.total_modal) as total_modal, p.amount as total_sell 
            from orders o
            join orders_detail od on o.order_number=od.order_number
            join payment p on o.order_number=p.order_number
            join users u on o.user_id=u.id_users
            join orders_status os on o.status=os.id_orders_status
            where o.status = 4
            group by o.order_number`
            const result = await asyncQuery(query)
            let totalProfit = []
            
            result.forEach(element => {
                element.profit = element.total_sell - element.total_modal
                totalProfit.push(element.profit)
            });
            const total = totalProfit.reduce((a,b) => a+b)

            res.status(200).send({total_profit: total})
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    highestProfit: async (req, res) => {
        try {
            const query = `select o.user_id, u.username, o.order_number, os.status, sum(od.total_modal) as total_modal, p.amount as total_sell 
            from orders o
            join orders_detail od on o.order_number=od.order_number
            join payment p on o.order_number=p.order_number
            join users u on o.user_id=u.id_users
            join orders_status os on o.status=os.id_orders_status
            where o.status = 4
            group by o.order_number`
            const result = await asyncQuery(query)
            let totalProfit = []
            
            result.forEach(element => {
                element.profit = element.total_sell - element.total_modal
                totalProfit.push(element.profit)
            });
            const highest = Math.max(...totalProfit)
            const id = result.findIndex(item => item.profit == highest)
            const username = result[id].username

            res.status(200).send({username: username, highest_profit: highest})
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    highestPkgSold: async (req, res) => {
        try {
            const query = `select package_name, count(package_id) as total 
            from pkg_sales
            group by package_id`
            const result = await asyncQuery(query)
            let qty = []
            
            result.forEach(element => {
                qty.push(element.total)
            });
            const highest = Math.max(...qty)
            const id = result.findIndex(item => item.total == highest)

            res.status(200).send(result[id])
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
}