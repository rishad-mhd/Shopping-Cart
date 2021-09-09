var db = require('../config/connection')
var collection = require('../config/colllections')
var objectId = require('mongodb').ObjectId
const { response } = require('express')
module.exports = {
    addProduct: (product, callback) => {
        price = parseInt(product.price)
        console.log(product)
        db.get().collection(collection.PRODUCT_COLLECTION)
            .insertOne({
                name: product.name,
                category: product.category,
                price: price,
                description: product.description

            }).then((data) => {
                console.log(data)
                callback(data.insertedId);
            })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(prodId) }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct: (proId, proDetails) => {
        let price = parseInt(proDetails.price)
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: objectId(proId) }, {
                    $set: {
                        name: proDetails.name,
                        description: proDetails.description,
                        price: price,
                        category: proDetails.category
                    }
                }).then((response) => {
                    resolve()
                })
        })
    },
    getAllusers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    getPlacedOrders: () => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({status: "placed" }).toArray()
                resolve(orders)
        })
    },
    shipProduct:(orderId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
            {
                $set:({status:'Shipped'})
            }
            ).then((response)=>{
                resolve(response)
            })
        })
    },
    getShippedOrders: () => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({status: "Shipped" }).toArray()
                resolve(orders)
        })
    },
    doLogin:(details)=>{
        let response={}
        return new Promise((resolve,reject)=>{
            if(details.email=='rishadmhd1414@gmail.com'&&details.password=='1234'){
                response.status=true
                response.admin='admin'
                resolve(response)
            }else{
                response.status=false
                resolve(response)
            }
        })
    }

}