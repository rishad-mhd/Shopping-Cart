var db = require('../config/connection')
var collection = require('../config/colllections')
var objectId = require('mongodb').ObjectId
module.exports = {
    addProduct: (product, callback) => {
        price=parseInt(product.price)
        console.log(product)
        db.get().collection(collection.PRODUCT_COLLECTION)
        .insertOne({
            name:product.name,
            category:product.category,
            price:price,
            description:product.description

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
        let price=parseInt(proDetails.price)
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({ _id: objectId(proId) },{
                $set:{
                    name:proDetails.name,
                    description:proDetails.description,
                    price:price,
                    category:proDetails.category
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
}