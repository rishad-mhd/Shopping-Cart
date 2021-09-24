const { response } = require("express")

function addTocart(proId) {
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            if(response.status){
                let count1=$('#cart-count1').html()
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                count1=parseInt(count1)+1
                $("#cart-count1").html(count1)
                $("#cart-count").html(count)
            }
        }
    })
}
function shipProduct(orderId){
    $.ajax({
        url:'/admin/ship-product/'+orderId,
        method:'get',
        success:(response)=>{
            alert('Product Shipped')
            location.reload()
        }

    })
}
