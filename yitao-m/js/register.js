window.onload = function () {
    var lock = false;
    Verification();
    function Verification() {
        var phone;
        var send = document.querySelector("#send");
        var num;
        var lock = true;
        var timer;
        var s;
        send.addEventListener("touchstart",function () {
            phone = document.querySelector("#phone");
            if(!/^1[34578]\d{9}$/.test(phone.value)){
                return;
                regular(num);
            }else{

            }
            if(lock){
                num = parseInt(Math.random()*888888+111111);
                alert(num);
                send.disabled = true;
                lock = false;
                s = 60;
                regular(num);
            }else{
                return;
            }

            timer = setInterval(function () {
                s--;
                send.innerText = "("+s+")";
                if(s <= 0){
                    clearInterval(timer);
                    lock = true;
                    send.disabled = false;
                    send.innerText = "获取验证码";
                }
            },1000);
        })

    }
    function regular(num){
        var phone = document.querySelector("#phone");
        var password = document.querySelector("#password");
        var verification = document.querySelector("#verification");
        var phoneParent = document.querySelector(".phone");
        var passwordParent = document.querySelector(".password");
        var verificationParent = document.querySelector(".verification");
        var passwordAlert = document.querySelector("#passwordAlert");
        var verificationAlert = document.querySelector("#verificationAlert");
        password.addEventListener("input",function(){
            if(!/[0-9A-z_]{6,12}/.test(password.value)){
                passwordAlert.innerText = "密码不合格!";
                passwordAlert.style.color = "red";
            }else{
                passwordAlert.innerText = "密码合格!";
                passwordAlert.style.color = "green";
            }
        });
        verification.addEventListener("input",function () {
            if(verification.value != num){
                verificationAlert.innerText = "验证码错误!";
                verificationAlert.style.color = "red";
            }else{
                verificationAlert.innerText = "验证码正确!";
                verificationAlert.style.color = "green";
                lock = true;
                slide(phone.value,password.value);
            }
        })
    }
    function slide(phone,password) {
       var Green = document.querySelector("#Green");
       var Rectangle = document.querySelector("#Rectangle");
       var VerifyRegistration = document.querySelector("#VerifyRegistration");
       var deltaX,
           newLeft,
           RectangleLeft,
           RectangleWidth,
           VerifyRegistrationWidth;
       Rectangle.addEventListener("touchstart",function (event) {
           event.preventDefault();
           if(!lock) return;
           console.log(lock);
           Rectangle.style.transition = "none";
           Green.style.transition = "none";
           deltaX = event.touches[0].clientX;
       });
       Rectangle.addEventListener("touchmove",function (event) {
           event.preventDefault();
           if(!lock) return;
           newLeft = event.touches[0].clientX - deltaX;
           RectangleLeft = this.offsetLeft;
           RectangleWidth = this.clientWidth;
           VerifyRegistrationWidth = VerifyRegistration.clientWidth;
           if(newLeft < 0) return;
           if(RectangleLeft + RectangleWidth >= VerifyRegistrationWidth){
               newLeft = VerifyRegistrationWidth-RectangleWidth;
               lock = false;
               Ajax("POST","api_user.php","status=register&username="+phone+"&password="+password
               ,function (response) {
                   if(response.code == 0){
                       Green.innerText = "验证通过!";
                       setTimeout(function () {
                           window.location.href = "login.html";
                       },1000)
                   }else if(response.code == 2001){
                       Green.style.backgroundColor = "red";
                       Green.innerText = "用户名已存在!";
                       setTimeout(function () {
                           window.location.reload();
                       },1000)
                   }
               });
           }
           Rectangle.style.left = newLeft + "px";
           Green.style.width = newLeft + "px";
           console.log(newLeft);
       });
       Rectangle.addEventListener("touchend",function (event) {
           event.preventDefault();
           if(RectangleLeft + RectangleWidth < VerifyRegistrationWidth){
               Rectangle.style.transition = "1s";
               Green.style.transition = "1s";
               Rectangle.style.left = "0";
               Green.style.width = "0";
           }
       })
    }
    var Return = document.querySelector("#return");
    Return.addEventListener("touchend",function () {
        window.history.go(-1);
    })
};