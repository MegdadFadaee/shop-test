let token = getCookie("jwt_token");
if (!token) {
    window.location.replace("./");
}

document.title = "فروشگاه - داشبورد";
$('.breadcrumb-content')[0].innerHTML = `<h2>داشبورد</h2>`;
$('.breadcrumb-area')[0].style.backgroundImage = '';

myaccountContent.style.direction = 'rtl';
myaccountContent.style.textAlign = 'right';

$('.myaccount-tab-menu a')[5].remove();
$('.myaccount-tab-menu a')[3].remove();
$('.myaccount-tab-menu a')[2].remove();

$('.myaccount-tab-menu a')[3].id = 'logout_btn';
$('#logout_btn').removeAttr('href');
logout_btn.onclick = function (){logout_user(0, true)};

dashboad.innerHTML = `<div class="myaccount-content">
                            <h3>داشبورد</h3>
                          </div>`;


$('#address-edit')[0].innerHTML = `<div class="myaccount-content">    
                                        <h3>آدرس پستی</h3>
                                        <div class="account-details-form">
                                            <form id="address_form">
                                                <div class="row">
                                                    <div class="col-lg-4">
                                                        <div class="single-input-item">
                                                            <label for="address_form_state" class="required">استان</label>
                                                            <input type="text" id="address_form_state" />
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <div class="single-input-item">
                                                            <label for="address_form_city" class="required">شهر</label>
                                                            <input type="text" id="address_form_city" />
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <div class="single-input-item">
                                                            <label for="address_form_zipcode" class="required">کد پستی</label>
                                                            <input type="text" id="address_form_zipcode" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="single-input-item">
                                                    <label for="address_form_address" class="required">آدرس پستی</label>
                                                    <input type="text" id="address_form_address" />
                                                </div>
                                                <div class="single-input-item">
                                                    <button type="button" class="check-btn sqr-btn" id="save_btn">ذخیره</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>`;

$('#orders')[0].innerHTML = `               <div class="myaccount-content">
                                                <h3>سفارشات</h3>
                                                <div class="myaccount-table table-responsive text-center">
                                                    <table class="table table-bordered">
                                                        <thead class="thead-light">
                                                            <tr>
                                                                <th>سفارش</th>
                                                                <th>تاریخ</th>
                                                                <th>وضعیت</th>
                                                                <th>هزینه پرداختی</th>
                                                                <th>لینک</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>1</td>
                                                                <td>Aug 22, 2018</td>
                                                                <td>Pending</td>
                                                                <td>$3000</td>
                                                                <td><a href="cart.html" class="check-btn sqr-btn ">View</a></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>`;

save_btn.onclick = function (){
    let url = '/users/addresses';
    let method = 'POST';
    let body = {
        'state': address_form_state.value,
        'city': address_form_city.value,
        'zipcode': address_form_zipcode.value,
        'address': address_form_address.value,
    }
    if (getCookie('address_id') != '0') {
        url += '/' + getCookie('address_id');
        method = "PATCH";
    }
    load_data(method, url, function (){location.reload()}, body);
}

function set_dashboard(user, url){
    let message = '<p class="mb-0"></p>'
    if (getCookie('address_id') === '0') {
        message = '<br><p class="mb-0" style="font-size: 28px; color: red">شما نیاز یه ثبت آدرس دارید.</p>'
    } else {
        load_data("GET", '/users/addresses/' + getCookie('address_id'), set_address);
    }

    dashboad.innerHTML = `<div class="myaccount-content">
                            <h3>داشبورد</h3>
                            <div class="welcome">
                                <p>سلام، <strong>${user['full_name']}</strong>
                            </div>
                            ${message}
                          </div>`;
}
function set_address(addresses, url){
    address_form_state.value = addresses['state'];
    address_form_city.value = addresses['city'];
    address_form_zipcode.value = addresses['zipcode'];
    address_form_address.value = addresses['address'];
}

function set_orders(orders, url){
    let DateTimeOptions = {weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit'};
    let tbody = '';
    orders.forEach(function (order, index) {
        let DateTime = new Date(order['created_at']).toLocaleString('fa-IR', DateTimeOptions)
        tbody += `<tr>
                    <td>${index + 1}</td>
                    <td>${DateTime}</td>
                    <td>${order['status']}</td>
                    <td>${order['total_payment'] || '0'}</td>
                    <td><a href="cart.html?id=${order['id']}" class="check-btn sqr-btn ">نمایش</a></td>
                  </tr>`;
    });

    $('#orders tbody')[0].innerHTML = tbody;
}

load_data("GET", '/users/user', set_dashboard);
load_data("GET", '/shop/orders', set_orders);
