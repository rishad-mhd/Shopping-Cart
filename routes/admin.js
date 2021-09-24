const { response } = require('express');
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
const session = require('express-session');
var productHelper = require('../helpers/product-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin/login')
  }
}
/* GET users listing. */
router.get('/',verifyLogin, function (req, res, next) {
  let adminLogin=req.session.admin
  productHelpers.getAllProducts().then((products) => {
    console.log(products)
    res.render('admin/view-products', { admin: true, products,adminLogin })
  })
});
router.get('/add-product',verifyLogin, function (req, res) {
  res.render('admin/add-product', { admin: true,adminLogin:req.session.admin })

})
router.post('/add-product', (req, res) => {
  console.log(req.body)
  console.log(req.files.image)
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.image
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('/admin')
      } else {
        console.log(err)
      }
    })
  })
})
router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect("/admin/")
  })
})
router.get('/edit-product/:id',verifyLogin, async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product', { product, admin: true,adminLogin:req.session.admin })
})
router.post("/edit-product/:id", (req, res) => {
  console.log(req.params.id);
  let id = req.params.id
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files.image) {
      let image = req.files.image
      image.mv('./public/product-images/' + id + '.jpg')
    }
  })
})
router.get('/view-users',verifyLogin, async (req, res) => {
  let user = await productHelpers.getAllusers()
  console.log(user)
  res.render('admin/view-users', { admin: true, user,adminLogin:req.session.admin})
})
router.get('/view-orders',verifyLogin, async (req, res) => {
  let order = await productHelpers.getPlacedOrders()
  console.log(order);
  res.render('admin/view-orders', { admin: true, order,adminLogin:req.session.admin})
})
router.get('/ship-product/:id', (req, res) => {
  console.log(req.params.id)
  productHelpers.shipProduct(req.params.id).then((response) => {
    res.json({ status: true })
  })
})
router.get('/view-shipped-orders',verifyLogin, async (req, res) => {
  let shippedOrders = await productHelpers.getShippedOrders()
  res.render('admin/view-shipped-orders', { shippedOrders, admin: true,adminLogin:req.session.admin})
})
router.get('/login', (req, res) => {
  
  if (req.session.admin) {
    res.redirect('/admin')
  } else {
    res.render('admin/login', { 'loginErr': req.session.adminLoginErr, admin: true })
    adminLoginErr = false
  }
})
router.post('/login', (req, res) => {
  productHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response.admin
      req.session.admin.loggedIn = true
      res.redirect('/admin')
    } else {
      req.session.adminLoginErr = "Invalid username or password"
      res.redirect('/admin/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.admin=null
  res.redirect('/admin')
})

module.exports = router;
