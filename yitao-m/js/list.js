window.onload = function () {
    var page = 1;
    var pagesize = 20;
    var classify = document.querySelector("#classify");
    console.log(classify);
    classify.addEventListener("touchstart",function () {
        console.log(1);
        window.history.go(-1);
    });
    var catId = getQueryString("cat_id");
    var goodsList = document.querySelector("#goodsList");
    Ajax("GET","api_cat.php","",function (response) {
        console.log(response);
        var oUl = document.createElement("ul");
        var html = "";
        for(var i = 0; i < response.data.length; i++){
            var obj = response.data[i];
            html += "<li><a data-id="+ obj.cat_id +">"+obj.cat_name+"</a></li>";
        }
        oUl.innerHTML = html;
        goodsList.appendChild(oUl);
        goodsLi(catId);
        goodsListLi();
    });
    function goodsLi(catId) {
        goodsListA = document.querySelectorAll("#goodsList ul li a");
        console.log(goodsListA);
        for(var i = 0; i < goodsListA.length; i++){
            if(goodsListA[i].getAttribute("data-id") == catId){
                goodsListA[i].parentNode.style.borderRightColor = "red";
            }else{
                goodsListA[i].parentNode.style.borderRightColor = "transparent";
            }
        }
    }
    goods(catId,page,pagesize);
    function goods(catId,page,pagesize){
        var CategoryProducts = document.querySelector(".CategoryProducts ul");
        var Html = '';
        Ajax("GET","api_goods.php?cat_id="+catId+"&page="+page+"&pagesize="+pagesize+"","",function(response){
            console.log(response);
            for(var i = 0; i < response.data.length; i++){
                var obj = response.data[i];
                Html += "<li><i></i><a href='details.html?goods_id="+ obj.goods_id+"'><img src='"+ obj.goods_thumb+"' alt=''><p>"+ obj.goods_name+"</p><span>￥"+obj.price+"</span></a></li>"
            }
            CategoryProducts.innerHTML += Html;
            lazy(response.page.page_count);
        });
    }
    var lock = true;
    function lazy(sum) {
        var container = document.querySelector(".CategoryProducts");
        var containerHeight;
        var sewheel;
        var visibleHeight;
        goTop(container);
        container.addEventListener("scroll",function(){
            containerHeight = container.offsetHeight;
            sewheel = this.scrollTop;
            visibleHeight = this.scrollHeight;
            console.log(containerHeight,sewheel,visibleHeight,lock);
            if(sewheel + containerHeight === visibleHeight){
                if(lock) {
                    page++;
                    lock = false;
                    if (page <= sum) {
                        goods(catId, page, pagesize);
                    }
                    setTimeout(function () {
                        lock = true;
                    }, 1000);
                }else{
                    return;
                }
            }
        })
    }
    function goTop(container){
        var Top = document.querySelector("#Top");
        var sewheel;
        var timer;
        Top.addEventListener("touchstart",function(){
            sewheel = container.scrollTop;
            timer = setInterval(function(){
                sewheel -= 50;
             if(sewheel < 0){
                 sewheel = 0;
                 clearInterval(timer);
                 container.scrollTop = sewheel;
                 return;
             }else{
                 container.scrollTop = sewheel;
             }
            },5);
        })
    }
    function goodsListLi() {
        page = 1;
        var A = document.querySelectorAll("#goodsList ul li a");
        var container = document.querySelector(".CategoryProducts ul");
        console.log(A);
        for(var i = 0; i < A.length; i++){
            A[i].addEventListener("touchstart",function (event) {
                catId = event.target.getAttribute("data-id");
                container.innerHTML = "";
                goods(catId,page,pagesize);
                goodsLi(catId);
            })
        }
    }
};