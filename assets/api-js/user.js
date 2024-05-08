document.title = "فروشگاه - ورود و ثبت نام"
$('.breadcrumb-content')[0].innerHTML = `<h2>ورود و ثبت نام</h2>`;
$('.login-toggle-btn')[0].innerHTML = '';
$('.breadcrumb-area')[0].style.backgroundImage = '';

function base_login_form(){
    $('.login-register-tab-list h4')[0].textContent = ' ورود ';

    $('.login-form-container')[0].style.direction = 'rtl';
    $('.login-form-container')[0].style.textAlign = 'right';
    $('.login-form-container')[0].innerHTML += `<br><p id="login_message"></p><div id="login_errors"></div>`;

    $('.login-register-wrapper form input')[0].id = 'login_username';
    $('.login-register-wrapper form input')[1].id = 'login_password';

    login_username.placeholder = 'نام کاربری';
    login_password.placeholder = 'رمز عبور';

    $(".button-box button")[0].id = 'login_btn';
    login_btn.textContent = 'ورود';
    login_btn.type = 'button';
    login_btn.onclick = function (){
        let body = {'username':login_username.value, 'password':login_password.value};
        load_data("POST", '/users/login', success_login, body, failed);
    };
}
function base_register_form(){
    $('.login-register-tab-list h4')[1].textContent = ' ثبت نام ';

    $('.login-form-container')[1].style.direction = 'rtl';
    $('.login-form-container')[1].style.textAlign = 'right';
    $('.login-form-container')[1].innerHTML += `<br><p id="register_message"></p><div id="register_errors"></div>`;

    $('.login-register-wrapper form input')[2].id = 'register_username';
    $('.login-register-wrapper form input')[3].id = 'register_password';
    $('.login-register-wrapper form input')[4].id = 'register_email';

    register_username.placeholder = 'نام کاربری';
    register_password.placeholder = 'رمز عبور';
    register_email.placeholder = 'ایمیل';

    let email = $('#register_email');
    $('#register_email').remove();
    $('#register_username').before(email);
    $('#register_email').before('<input id="register_name" type="text" name="register-name" placeholder="نام">')
    $('#register_email').before('<input id="register_family" type="text" name="register-family" placeholder="نام خانوادگی">')
    $('#register_email').before('<input id="register_mobile" type="text" name="register-mobile" placeholder="تلفن همراه">')

    $(".button-box button")[1].id = 'register_btn';
    register_btn.textContent = 'ثبت نام';
    register_btn.type = 'button';
    register_btn.onclick = function (){
        let body = {
            'name':register_name.value,
            'family':register_family.value,
            'mobile':register_mobile.value,
            'email':register_email.value,
            'username':register_username.value,
            'password':register_password.value
        };
        load_data("POST", '/users/register', success_login, body, failed);
    };
}

function success_login(data){
    login_message.textContent = 'شما با موفقیت وارد شدید.';
    setCookie('jwt_token', data['token']);
    setCookie('user_id', data['user_id']);
    window.location.replace("./");
}
function failed(xhr){
    let result = JSON.parse(xhr.responseText);
    login_message.textContent = result['message'];
    register_message.textContent = result['message'];
    let errors = '';
    for (i in result['errors']){
        errors += `<li>${result['errors'][i]}</li>`;
    }
    login_errors.innerHTML = `<ul>${errors}</ul>`;
    register_errors.innerHTML =`<ul>${errors}</ul>`;
}
base_login_form();
base_register_form();