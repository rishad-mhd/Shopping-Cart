const { response } = require('express');
var express = require('express');
const session = require('express-session');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.user){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/',async function(req, res, next) {
  let user=req.session.user
  console.log(user)
  let cartCount=null
  if(req.session.user){
  cartCount=await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{admin:false,products,user,cartCount})
  })
});
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
  res.render('user/login',{'loginErr':req.session.userLoginErr})
  req.session.userLoginErr=false
  }
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  let name = req.body.name
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.user={_id:response,name}
    req.session.user.loggedIn=true
    
    res.redirect('/')
  })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.user=response.user
      req.session.user.loggedIn=true
      res.redirect('/')
    }else{
      req.session.userLoginErr="Invalid username or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.user=null
  res.redirect('/')
})
router.get('/cart',verifyLogin,async(req,res)=>{
  let totalValue=0
  let products=await userHelpers.getCartProducts(req.session.user._id)
  if(products !=0){
  totalValue= await userHelpers.getTotalAmount(req.session.user._id)
  }
  console.log(totalValue)
  res.render('user/cart',{products,user:req.session.user,totalValue})
})
router.get('/add-to-cart/:id',(req,res)=>{
  console.log('api-call')
  if(req.session.user){
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
  }else{
    res.json({status:false})
  }
})
router.post('/change-product-quantity',(req,res,next)=>{
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    console.log(response);
    if (response.status){
    response.total=await userHelpers.getTotalAmount(req.body.user)
    }
    res.json(response)
  })
})
router.post('/remove-cart-item',(req,res)=>{
  userHelpers.removeCartItem(req.body).then((response)=>{
    res.json(response)
  })
})
router.get('/place-order',verifyLogin,async(req,res)=>{
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order',{user:req.session.user,total})
})
router.post('/place-order',async(req,res)=>{
  let products=await userHelpers.getCartProductList(req.body.userId)
  let totalPrice=await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,totalPrice,req.session.user).then((orderId)=>{
    if(req.body['payment-method']==='COD'){
      res.json({codSuccess:true})
    }else{
      userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
        res.json(response)
      })
    }
    
  })
  console.log(req.body)
})
router.get('/order-success',(req,res)=>{
  res.render('user/order-success')
})
router.get('/order',async(req,res)=>{
  let order=await userHelpers.getOrdersList(req.session.user._id)
  let pending=await userHelpers.getPendingOrder(req.session.user._id)
  console.log(order);
    res.render('user/order',{order,user:req.session.user,pending})
})
router.get('/view-order-products/:id',async(req,res)=>{
  console.log(req.params.id)
  let products=await userHelpers.getOrderProducts(req.params.id)
  console.log(products)
  res.render('user/view-order-products',{products, user:req.session.user})
})
router.post('/verify-payment',(req,res)=>{
  console.log(req.body);
  userHelpers.verifyPayment(req.body).then(()=>{
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log('Payment Successfull')
      res.json({status:true})
    })
  }).catch((err)=>{
    console.log(err)
    res.json({status:false,errMsg:''})
  })
})
router.get('/pending-orders',async(req,res)=>{
  let pending=await userHelpers.getPendingOrder(req.session.user._id)
  res.render('user/pending-orders',{pending,user:req.session.user})
})
router.get('/replace-order/:id',async(req,res)=>{
  let pendingOrder=await userHelpers.replacePendingOrders(req.params.id)
  userHelpers.addToCart(pendingOrder[0].item,req.session.user._id).then((response)=>{
    userHelpers.deletePendingOrder(req.params.id).then(()=>{
      res.redirect('/cart')
    })
    
  })
    
})
router.get('/category/:value',async(req,res)=>{
  value=req.params.value;
  let cartCount=null
  let products=await userHelpers.getCategoryProducts(value)
  if(req.session.user){
    cartCount=await userHelpers.getCartCount(req.session.user._id)
    }
  res.render('user/category',{products,user:req.session.user,value,cartCount})
})



module.exports = router;
