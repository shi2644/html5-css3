window.onload = function(){
    function Details() {
        this.goodsId = "";
        this.buy = null;
        this.getToken = '';
        this.goodsNumber = 0;
        this.addCar = null;
        Details.prototype.init = function () {
          this.goodsId = getQueryString("goods_id");
          this.buy = document.querySelector("#buy");
          this.getToken = localStorage.getItem("token");
          this.goodsNumber = localStorage.getItem(this.goodsId+"number") || 1;
          this.addCar = document.querySelector("#addCar");
        };
        Details.prototype.goods = function () {
            var goodsDetails = document.querySelector("#goodsDetails");
            var self = this;
            var html = "";
            Ajax("GET","api_goods.php?goods_id="+self.goodsId,"",function (response) {
            var obj = response.data[0];
            console.log(obj);
                html += "<div><img src="+ obj.goods_thumb+" alt=''></div><h1>"+obj.goods_name+"</h1><p>"+obj.goods_desc+"</p><span>"+obj.price+"元</span><span>降价通知</span>";
                goodsDetails.innerHTML = html;
            });
        };
        Details.prototype.previous = function () {
            var retreat = document.querySelector(".retreat");
            retreat.addEventListener("touchstart",function () {
                window.history.go(-1);
            })
        };
        Details.prototype.addCart = function () {
            var self = this;
            this.addCar.addEventListener("touchstart",function () {
                if(!localStorage.getItem("token")){
                    location.href = "login.html";
                    return;
                }
                if(self.goodsNumber >= 10){
                    self.goodsNumber=10;
                    window.localStorage.setItem(self.goodsId+"number",self.goodsNumber);
                }else{
                    self.goodsNumber+=1;
                }
                console.log(self.goodsNumber);
                window.localStorage.setItem(self.goodsId+"number",self.goodsNumber);
                Ajax("POST","api_cart.php?token="+self.getToken,"goods_id="+ self.goodsId+"&number="+ self.goodsNumber,function (response) {
                    console.log(response);
                })
            });
            this.buy.addEventListener("touchstart",function () {
                window.location.href = "cart.html";
            })
        };
        this.init();
        this.goods();
        this.previous();
        this.addCart();
    }
    new Details();
};