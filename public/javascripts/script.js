const { response } = require("express")

function addTocart(proId) {
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
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
