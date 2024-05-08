const API_BASE = 'https://api.mahakiha.ir'
function get_parameter(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}
function default_error(xhr, exception){
    // console.log(xhr.status);
}
function load_data(methode, url, on_success, body= {}, on_error=default_error){
    url = API_BASE + url;
    const xhr = new XMLHttpRequest();
    xhr.open(methode, url);
    xhr.setRequestHeader('Authorization', getCookie("jwt_token"));
    xhr.setRequestHeader('app-id', '1');
    xhr.onload = function () {
        if (300 > this.status && this.status > 199){
            let result = JSON.parse(this.responseText);
            let data = result['data'];
            on_success(data, url);
        } else {
            on_error(this);
        }
    };
    xhr.onerror = function () {
        on_error(this);
    };

    let fd = new FormData();
    for (let key in body) {
        fd.append(key, body[key]);
    }

    xhr.send(fd);
}
function delete_data(url) {
    url = API_BASE + url;
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.setRequestHeader('Authorization', getCookie("jwt_token"));
    xhr.send();
}
function setCookie(cname, cvalue, exdays= 10) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function price_format(price){
    return Number(price).toLocaleString();
}
function set_menu(categories, url){
    app_menu.innerHTML = "";
    mobile_menu.innerHTML = "";
    categories.forEach(function (category, index){
        let href = `categories.html?id=${category['id']}`;
        if (category['parent_id'] === null){
            app_menu.innerHTML += `<li class="angle-shape"><a href="${href}">${category['name']}</a><ul id="sub_app_menu_${category['id']}" class="submenu"></ul></li>`;
            mobile_menu.innerHTML += `<li class="menu-item-has-children"><a href="${href}">${category['name']}</a><ul id="sub_mobile_menu_${category['id']}" class="submenu"></ul></li>`;
        } else {
            let html = `<li><a href="${href}">${category['name']}</a></li>`;
            document.getElementById(`sub_app_menu_${category['parent_id']}`).innerHTML += html;
            document.getElementById(`sub_mobile_menu_${category['parent_id']}`).innerHTML += html;
        }
    });
}
function check_user(){
    $('.header-wishlist')[0].innerHTML = '';

    let token = getCookie("jwt_token");
    if (token) {
        load_data("GET", '/users/user', login_user, [], logout_user);
    } else {
        $('.cart-wrap ')[0].innerHTML = '';
    }
}
function login_user(data, url){
    $('.header-wishlist')[0].innerHTML = `<a onclick="logout_user(0, true)"><i class="la la-sign-out"></i></a>\n`;
    $('.header-login')[0].innerHTML = `<a href="my-account.html" style="font-size: 14px">${data['full_name']}</a>`;
    if (window.location.href.includes('login')) {
        window.location.replace("./");
    }
    load_data("GET", '/users/addresses', find_address);
}
function logout_user(xhr, refresh=false){
    $('.header-wishlist')[0].innerHTML = '';
    setCookie('jwt_token', '');
    setCookie('user_id',  '');
    setCookie('order_id', '');
    setCookie('address_id', '0');
    if (refresh){
        location.reload();
    }
}
function base_cart(){
    $('.mini-cart-price')[0].innerHTML = '';

    $('.shopping-cart-top')[0].innerHTML = '<h3>سبد خرید</h3><a class="cart-close" href="#"><i class="la la-close"></i></a>';
    $('.shopping-cart-top')[1].innerHTML = '<h3>سبد خرید</h3><a class="cart-close" href="#"><i class="la la-close"></i></a>';

    $('.shopping-cart-content')[0].children[1].id = 'desc_cart_item';
    $('.shopping-cart-content')[1].children[1].id = 'phon_cart_item';

    $('.shopping-cart-total')[0].innerHTML = '<h4>مجموع <span id="desc_cart_total" class="shop-total">0 تومان</span></h4>';
    $('.shopping-cart-total')[1].innerHTML = '<h4>مجموع <span id="phon_cart_total" class="shop-total">0 تومان</span></h4>';

    $("a[href='checkout.html']")[0].textContent = 'پرداخت';
    $("a[href='checkout.html']")[1].textContent = 'پرداخت';
}
function find_address(addresses, url){
    setCookie('address_id', '0')
    if (addresses.length < 1){
        if ((window.location + '').includes('my-account')) {
            // desc_cart_item.innerHTML = '';
            // phon_cart_item.innerHTML = '';
            return;
        }
        window.location.replace("./my-account.html?#address-edit");
    }
    setCookie('address_id', addresses[0]['id'])
    load_data("GET", '/shop/orders', find_order);
}
function find_order(orders, url){
    let open_order = null;
    orders.forEach(function (order, index){
        if (order['status'] === 'باز'){
            open_order = order;
            return;
        }
    });
    if (!open_order){
        load_data("POST", '/shop/orders', function (){}, {'user_address_id': getCookie('address_id')});
        load_data("GET", '/shop/orders', find_order);
        return;
    }
    setCookie('order_id', open_order['id']);
    load_data("GET", `/shop/orders/${open_order['id']}/items`, set_order_items);
}
function set_order_items(items, url) {
    desc_cart_item.innerHTML = '';
    phon_cart_item.innerHTML = '';

    items.forEach(function (item, index){
        let price = item['total_discount'] ? item['total_discount'] : item['total_price'];
        const product_url = `${API_BASE}/shop/products/${item['product_id']}`;
        const product_page = `product.html?id=${item['product_id']}`;
        desc_cart_item.innerHTML += `       <li class="single-shopping-cart">
                                                <div class="shopping-cart-img">
                                                    <a href="${product_page}"><img alt="" src="${product_url}/image?width=70&height=70"></a>
                                                    <div class="item-close">
                                                        <a href="#"><i class="sli sli-close"></i></a>
                                                    </div>
                                                </div>
                                                <div class="shopping-cart-title">
                                                    <h4><a href="${product_page}">${item['title']}.</a></h4>
                                                    <span>${price} تومان</span>
                                                </div>
                                                <div class="shopping-cart-delete">
                                                    <a onclick="remove_order_item(${item['id']})"><i class="la la-trash"></i></a>
                                                </div>
                                            </li>`;
        phon_cart_item.innerHTML = desc_cart_item.innerHTML;
    });

    $('.count-style')[0].textContent = phon_cart_item.children.length + ' محصول';

    load_data("PATCH", `/shop/orders/${getCookie('order_id')}/price`, reset_order_price);
}
function remove_order_item(id){
    delete_data(`/shop/order/items/${id}`);
    load_data("GET", `/shop/orders/${getCookie('order_id')}/items`, set_order_items);
}
function reset_order_price(orders, url){
    desc_cart_total.textContent = orders['total_payment'] + ' تومان';
}
document.getElementsByTagName('nav')[0].children[0].id = 'app_menu';
document.getElementsByTagName('nav')[1].children[0].id = 'mobile_menu';
base_cart();
check_user();
load_data("GET", '/shop/categories', set_menu);
