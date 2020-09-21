const {asyncQuery} = require('../helpers/queryHelp')

module.exports = {
    salesReport: async (req, res) => {
        try {
            const query = `select o.user_id, o.order_number, o.status, sum(od.total_modal) as total_modal, p.amount 
            from orders o
            join orders_detail od on o.order_number=od.order_number
            join payment p on o.order_number=p.order_number
            where o.status = 4
            group by o.order_number;`
            const result = await asyncQuery(query)
            
            result.forEach(element => {
                element.profit = element.amount - element.total_modal
            });

            res.status(200).send(result)
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    salesRepPkg: async (req, res) => {
        try {
            const query = `select o.order_number, o.user_id, od.package_id, p.package_name, sum(od.total_modal) as total_modal, p.package_price, 
            concat(o.order_number, od.package_id ,od.package_no) as package 
            from orders o
            join orders_detail od on o.order_number=od.order_number
            join package p on od.package_id=p.id_product_package
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
            const queryPayment = `update from payment set payment_status_id=2
                           where order_number=${parseInt(req.params.on)}`
            const resultPayment = await asyncQuery(queryPayment)

            const queryOrders = `update from orders set status=4 where order_number=${parseInt(req.params.on)}`

            res.status(200).send(queryOrders)
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    cancelPayment: async (req, res) => {
        try {
            const queryPayment = `update from payment set payment_status_id=3
                           where order_number=${parseInt(req.params.on)}`
            const resultPayment = await asyncQuery(queryPayment)

            const queryOrders = `update from orders set status=5 where order_number=${parseInt(req.params.on)}`
            const resultOrders = await asyncQuery(queryOrders)

            res.status(200).send(resultOrders)
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    transHistory: async (req, res) => {
        try {
            const query = `select p.users_id, p.order_number, p.payment_date, pt.via_bank, p.amount, p.transaction_receipt, ps.status 
            from payment p
            join payment_type pt on p.payment_type_id=pt.id_payment_type
            join payment_status ps on p.payment_status_id=ps.id_payment_status`
            const result = await asyncQuery(query)

            res.status(200).send(result)
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}