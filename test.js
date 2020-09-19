// const a = Date.now()
// console.log(typeof(a))

// const array = []
// const array2 = [{}]
// console.log(Boolean([]))
// console.log('array kosong : ', array[0])
// console.log('array2 object : ', array2[0])
// console.log('array2 object type : ', Boolean(array2[0]))

const body = {
    user_id: 5,
    package_id: 2,
    product_id: [1,2,3,4,5,6],
    qty: [1,1,2,1,1,2],
    total: [4000, 5000,6000,7000,8000,9000],
    order_number: 'order_number'
}
const {user_id, package_id, product_id, qty, total, order_number} = body
// console.log(product_id.length)

let res = ''
for (let i=0;i<body.product_id.length;i++) {
    res += `values (${order_number}, ${package_id}, ${product_id[i]}, ${qty[i]}, ${total[i]}, ${order_number}),`
}
console.log(res)
res.slice(0, -1)
console.log(res)

// const query = `INSERT INTO orders_detail (order_number, package_id, product_id, qty, total) ` + res
// console.log(query)