/*
 *   Order.js
 *   Final
 *
 *   Revision History
 *      Boa Im, 2022.04.18: Created
 */

const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderSchema = new schema({
    name: String,
    studentid: Number,
    html5: Number,
    css3: Number,
    pen: Number,
    subtotal: Number,
    tax: Number,
    total: Number,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;