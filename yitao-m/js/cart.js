window.onload = function () {
    function Cart() {
        this.userToken = "";
        this.dom = null;
        this.compileBut = null;
        this.plusBut = null;
        this.minusBut = null;
        this.extendedPriceDom = null;
        this.check = null;
        this.checkedArr = [];
        this.subtotal = null;
        this.extendedPrice = 0;
        this.checkAll = null;
        this.removeDom = null;
        this.removeDomArr = [];
        this.verify = null;
        this.init();
        this.requestAjax();
        this.binding();
        this.bindingCheckAll();
        this.bindingRemove();
    }
    Cart.prototype.init = function () {
        this.userToken = localStorage.getItem("token");
        this.compileBut = document.querySelector("#compileBut");
        this.dom = document.querySelector("#cartGoods ul");
        this.extendedPriceDom = document.querySelector("#extendedPrice");
        this.checkAll = document.querySelector("#checkAll");
        this.removeDom = document.querySelector("#removeGoods");
    };
    Cart.prototype.bindingRemove =function () {
        var self = this;
        var lock = true;
        this.compileBut.addEventListener("touchstart",function () {
            if(lock){
                self.removeDom.style.display = "inline-block";
                lock = false;
            }else{
                self.removeDom.style.display = "none";
                lock = true;
            }
        });
        this.removeDom.addEventListener("touchstart",function () {
            for(var i = 0; i < self.checkedArr.length; i++){
                self.postAjax(self.checkedArr[i],0);
                self.removeDomArr[i].remove();
            }
            this.style.display = "none";
        })
    };
    Cart.prototype.bindingCheckAll = function () {
        var self = this;
        self.checkAll.addEventListener("touchstart",function () {
            console.log(1);
            for(var i = 0; i < self.check.length; i++){
                self.check[i].checked = !this.checked;
                console.log(self.check[i].checked,this.checked);
            }
            self.countExtendedPrice();
        })
    };
    Cart.prototype.postAjax = function (goodsId,goodsNumber) {
        var self = this;
        Ajax("POST","api_cart.php?token="+self.userToken,"goods_id="+goodsId+"&number="+goodsNumber,function (response) {
            console.log(response);
        })
    };
    Cart.prototype.countExtendedPrice = function () {
        var self = this;
        setTimeout(function () {
            self.check = document.querySelectorAll(".checkBox");
            self.extendedPrice = 0;
            self.checkAll.checked = true;
            self.checkedArr = [];
            self.removeDomArr = [];
            for(var i = 0; i < self.check.length; i++){
                // console.log(this.check[i].checked);
                if(self.check[i].checked === true){
                    self.checkedArr.push(self.check[i].parentNode.parentNode.getElementsByClassName("hid")[0].value);
                    self.removeDomArr.push(self.check[i].parentNode.parentNode);
                    self.extendedPrice += parseInt(self.check[i].parentNode.parentNode.getElementsByClassName("subtotal")[0].innerText);
                }else{
                    self.checkAll.checked = false;
                }
            }
            console.log(self.checkedArr);
            console.log(self.removeDomArr);
            self.extendedPriceDom.innerText =  self.extendedPrice + "元";
        },150);
    };
    Cart.prototype.binding = function () {
        var self = this;
        this.dom.addEventListener("touchstart",function (event) {
            var target = event.target || event.srcElement;
            if(target.className==="plusBut"){
               self.subtotal = target.parentNode.previousElementSibling;
                console.log(self.subtotal);
               var goodsId = target.parentNode.parentNode.nextElementSibling.value;
               console.log(goodsId);
                if(target.nextElementSibling.value == 10){
                    target.nextElementSibling.value = 10;
                    return;
                }else{
                    target.nextElementSibling.value = ++target.nextElementSibling.value;
                    self.postAjax(goodsId,target.nextElementSibling.value);
                    self.subtotal.innerText = self.subtotal.getAttribute("data-id")*target.nextElementSibling.value + "元";
                    self.countExtendedPrice();
                }

            }
            if(target.className==="minusBut"){
                self.subtotal = target.parentNode.previousElementSibling;
                console.log(self.subtotal);
                var goodsId = target.parentNode.parentNode.nextElementSibling.value;
                console.log(goodsId);
                if(target.previousElementSibling.value == 1){
                    target.previousElementSibling.value = 1;
                    return;
                }else{
                    target.previousElementSibling.value = --target.previousElementSibling.value;
                    self.postAjax(goodsId,target.previousElementSibling.value);
                    self.subtotal.innerText = self.subtotal.getAttribute("data-id")*target.previousElementSibling.value + "元";
                    self.countExtendedPrice();
                }
            }
            if(target.className === "checkBox"){

                console.log(1);
                self.countExtendedPrice();
            }
            if(target.className === "goodsNumber"){
                self.subtotal = target.parentNode.previousElementSibling;
                console.log(self.subtotal);
                var goodsId = target.parentNode.parentNode.nextElementSibling.value;
                console.log(goodsId);
                target.addEventListener("input",function () {
                    if(/[0-9]/.test(target.value)){
                        if(target.value > 10){
                            target.value = 10;
                        }else if(target.value < 1){
                            target.value = 1;
                        }
                    }else{
                        target.value = "";
                    }
                });
                target.addEventListener("blur",function () {
                    if(target.value === ""){
                        target.value = 1;
                    }
                    self.postAjax(goodsId,target.value);
                    self.subtotal.innerText = self.subtotal.getAttribute("data-id")*target.value + "元";
                    self.countExtendedPrice();
                })
            }
        })
    };
    Cart.prototype.addHtml = function (response) {
        var html = '';
        console.log(response);
        for(var i = 0; i < response.data.length; i++){
            var obj = response.data[i];
            html += `<li><div class=check><input type=checkbox class=checkBox></div>
            <img src=${obj.goods_thumb} alt=><div class=cart-right><p>${obj.goods_name}</p>
            <span class=subtotal data-id=${obj.goods_price}>${obj.goods_price*obj.goods_number}元</span>
            <div class=cart-but><button class=plusBut>+</button><input type=tel class=goodsNumber value=${obj.goods_number}>
            <button class=minusBut>-</button></div></div><input class="hid" type=hidden value=${obj.goods_id}></li>`;
        }
        this.dom.innerHTML = html;
        this.countExtendedPrice();
    };
    Cart.prototype.requestAjax = function () {
        var self = this;
      Ajax("GET","api_cart.php?token="+self.userToken,"",function (response) {
          self.addHtml(response);
      })
    };
    new Cart();
};