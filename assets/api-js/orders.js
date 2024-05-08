function fail_order(order, url) {
    // window.location.replace("my-account.html");
}
function set_order_items(items, url) {
    if (items.length){
        $('table tbody')[0].innerHTML = '';
    }
    items.forEach(function (item, index) {
        let product_link = 'product.html?id=' + item['product_id'];

        $('table tbody')[0].innerHTML += `<tr>
                                            <td class="product-thumbnail">
                                                <a href="${product_link}"><img src="${API_BASE}/shop/products/${item['product_id']}/image?width=82&height=82" alt=""></a>
                                            </td>
                                            <td class="product-name"><a href="${product_link}">${item['title']}</a></td>
                                            <td class="product-price-cart"><span class="amount">${item['discounted_price'] || item['price']} ${'تومان'}</span></td>
                                            <td class="product-quantity">${item['number']}</td>
                                                    <!--<input class="cart-plus-minus-box" type="text" name="qtybutton" value="0">-->
                                            <td class="product-subtotal">${item['total_discount'] || item['total_price']} ${'تومان'}</td>
                                            <td class="product-remove">
                                                <a href="javascript:void(0)"><i class="la la-close"></i></a>
                                            </td>
                                         </tr>`;

    })
}

const order_id = get_parameter('id')
if (!order_id){
    window.location.replace("my-account.html");
}


document.title = "فروشگاه - سفارش شماره " + order_id;
$('.breadcrumb-content')[0].innerHTML = `<h2>سفارش شماره ${order_id}</h2>`;
$('.breadcrumb-area')[0].style.backgroundImage = '';
$('.container')[3].style.direction = 'rtl';
$('.container')[3].style.textAlign = 'right';
$('.cart-page-title')[0].textContent = 'لیست محصولان';
$('table thead')[0].innerHTML = '<tr><th>تصویر</th><th>نام محصول</th><th>قیمت</th><th>تعداد</th><th>مجموع قیمت</th><th>حذف</th></tr>';
$('table tbody')[0].innerHTML = '<tr><td class="product-thumbnail"></td><td class="product-name"></td><td class="product-price-cart"></td><td class="product-quantity"></td><td class="product-subtotal"></td><td class="product-remove"></td></tr>';
$('.row')[4].remove();
$('.row')[3].remove();


load_data('GET', `/shop/orders/${order_id}`, default_error, [], fail_order);
load_data('GET', `/shop/orders/${order_id}/items`, set_order_items);
