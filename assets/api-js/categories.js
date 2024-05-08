function set_category(category, url){
    document.title = "فروشگاه - " + category['name'];
    $('.breadcrumb-content')[0].innerHTML = `<h2>${category['name']}</h2>`;
    $('.pagination-style ')[0].innerHTML = '';
    $('.breadcrumb-area')[0].style.backgroundImage = '';
}
function set_image(images, url){
    let file_id= 0;
    if (images.length > 0) {
        file_id = `${images[0]['file_id']}`;
    }
    const product_id = url.split('/')[5] ;
    const img_url = `${url}/${file_id}?width=400&height=400`;
    document.getElementById(`pro-img-1-${product_id}`).src = img_url;
    document.getElementById(`pro-img-2-${product_id}`).src = img_url;
}

function set_products(products, url){
    const rows1 = document.getElementById('shop-1').children[0];
    const rows2 = document.getElementById('shop-2');
    rows1.innerHTML = '';
    rows2.innerHTML = '';
    rows2.style.direction = 'rtl';
    products.forEach(function (product, index){
        const product_id = product['id'];
        let new_price = price_format(product['price']) + ' تومان';
        let old_price = '';
        let discounted = product['discounted_price'];
        if (Number(discounted)){
            new_price = price_format(discounted) + ' تومان';
            old_price = price_format(product['price']) + ' تومان';
        }

        rows1.innerHTML += `            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                            <div class="product-wrap mb-35">
                                                <div class="product-img mb-15">
                                                    <a href="product.html?id=${product_id}"><img id="pro-img-1-${product_id}" src="${API_BASE}/shop/products/${product_id}/image?width=400&height=400" alt="product"></a>
                                                    <div class="product-action">
                                                        <a data-toggle="modal" data-target="#exampleModal" title="Quick View" href="#"><i class="la la-plus"></i></a>
                                                        <a title="Wishlist" href="#"><i class="la la-heart-o"></i></a>
                                                        <a title="Compare" href="#"><i class="la la-retweet"></i></a>
                                                    </div>
                                                </div>
                                                <div class="product-content">
                                                    <span>${product['category']}</span>
                                                    <h4><a href="product.html?id=${product_id}">${product['title']}</a></h4>
                                                    <div class="price-addtocart">
                                                        <div class="product-price">
                                                            <span>${price_format(product['price'])}T</span>
                                                        </div>
                                                        <div class="product-addtocart">
                                                            <a title="Add To Cart" href="#">+ Add To Cart</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
        rows2.innerHTML += `        <div class="shop-list-wrap mb-30">
                                        <div class="row">
                                            <div class="col-xl-4 col-lg-5 col-md-6 col-sm-6">
                                                <div class="product-list-img">
                                                    <a href="product.html?id=${product_id}">
                                                        <img id="pro-img-2-${product_id}" src="${API_BASE}/shop/products/${product_id}/image?width=400&height=400" alt="Product Style">
                                                    </a>
                                                    <div class="product-list-quickview">
                                                        <a data-toggle="modal" data-target="#exampleModal" title="Quick View" href="#"><i class="la la-plus"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-8 col-lg-7 col-md-6 col-sm-6">
                                                <div class="shop-list-content">
                                                    <span>${product['category']}</span>
                                                    <h4><a href="product.html?id=${product_id}">${product['title']}}</a></h4>
                                                    <div class="pro-list-price">
                                                        <span>${new_price}</span>
                                                        <span class="old-price">${old_price}</span>
                                                    </div>
                                                    <p>${product['body']}</p>
                                                    <div class="product-list-action">
                                                        <a title="Wishlist" href="#"><i class="la la-heart-o"></i></a>
                                                        <a title="Compare" href="#"><i class="la la-retweet"></i></a>
                                                        <a title="Add To Cart" href="#"><i class="la la-shopping-cart"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
        // load_data("GET", `/shop/products/${product_id}/images`, set_image);
    });

}

const category_id = get_parameter('id');
if (category_id) {
    load_data("GET", `/shop/categories/${category_id}`, set_category);
    load_data("GET", `/shop/categories/${category_id}/products`, set_products);
} else {
    let data = {'name': 'خانه'};
    set_category(data);
    load_data("GET", `/shop/products`, set_products);

}