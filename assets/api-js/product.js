function set_product(product, url) {
    document.title = "فروشگاه - " + product['title'];
    $('.breadcrumb-content')[0].innerHTML = `<h2>${product['title']}</h2>`;

    let pro = $('.pro-details-content-modify')[0];
    pro.style.direction = 'rtl';
    pro.style.textAlign = 'right';
    pro.children[0].textContent = product['category'];
    pro.children[1].textContent = product['title'];
    pro.children[1].after(product['description']);

    $("input[name='qtybutton']")[0].value = 0;
    // $("input[name='qtybutton']")[1].value = 0;

    let new_price = price_format(product['price']) + ' تومان';
    let old_price = '';
    let discounted = product['discounted_price'];
    if (Number(discounted)){
        new_price = price_format(discounted) + ' تومان';
        old_price = price_format(product['price']) + ' تومان';
    }

    $('.zoompro-border')[0].children[1].remove();
    $('.zoompro')[0].src = `${API_BASE}/shop/products/${product['id']}/image?width=570&height=570`;
    $('.zoomWindow')[0].style.backgroundImage = `url("${API_BASE}/shop/products/${product['id']}/image?width=1200&height=1125")`;
    gallery.innerHTML = '';

    $('.product-ratting-review')[0].innerHTML = '<div class="la"></div>';
    $('.pro-details-color-wrap')[0].innerHTML = '<div class="la"></div>';
    $('.pro-details-size')[0].innerHTML = '<div class="la"></div>';
    $('.pro-details-price-wrap')[0].innerHTML = `<div class="product-price"><span>${new_price}</span><span class="old">${old_price}</span></div>`;
    $('.pro-details-compare-wishlist')[0].innerHTML = '';
    $('.description-review-wrapper')[0].innerHTML = '';
    $('.product-area')[0].innerHTML = '';
    $('.breadcrumb-area')[0].style.backgroundImage = '';


    $('.pro-details-buy-now')[0].innerHTML = `<a>افزودن محصول</a>`;
    $('.pro-details-buy-now a')[0].onclick = add_product;
    $('.pro-details-buy-now a')[1].textContent = 'افزودن محصول';
    $('.pro-details-buy-now')[1].innerHTML = `<a>افزودن محصول</a>`;
    $('.pro-details-buy-now a')[1].onclick = add_product;

}

function add_product(){
    let body = {
        'order_id': getCookie('order_id'),
        'product_id': get_parameter('id'),
        'number': parseInt($("input[name='qtybutton']")[0].value),
    };
    if (!body['order_id']) {
        window.location.replace("./login-register.html");
    }
    if (body['number'] > 0){
        load_data("POST", '/shop/items', function (){}, body);
        $("input[name='qtybutton']")[0].value = 0;
        load_data("GET", `/shop/orders/${body['order_id']}/items`, set_order_items);
    }
}

function set_images(images, IMG_BASE){
    const ferst_id = images[0]['file_id'];
    $('.zoompro-border')[0].children[1].remove();
    $('.zoompro')[0].src = `${IMG_BASE}/${ferst_id}?width=570&height=570`;
    $('.zoomWindow')[0].style.backgroundImage = `url("${IMG_BASE}/${ferst_id}?width=1200&height=1125")`;
    gallery.innerHTML = '';
}


const product_id = get_parameter('id');
load_data("GET", `/shop/products/${product_id}`, set_product);
