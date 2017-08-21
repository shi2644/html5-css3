window.onload = function () {
    var username = document.querySelector("#username");
    var Out;
    if(localStorage.getItem("token")){
        username.innerHTML = "<a href='#' class='username'>"+localStorage.getItem("username")+"</a><a href='#' id='Out'>退出</a>";
        Out = document.querySelector("#Out");
        outBut();
    }
    function outBut() {
        Out.addEventListener("touchstart",function (event) {
            event.preventDefault();
            localStorage.clear();
            window.location.reload();
        });
    }
    var carousel = document.querySelector(".carousel");
    var carouselLi = document.querySelectorAll(".carousel>ul li");
    var circles = document.querySelectorAll('.circles>ul li');
    var windowWidth;
    var page = 1;
    var pagesize = 10;
    var next = 1;
    var idx = 0;
    var prev = carouselLi.length - 1;
    init();
    var timer = setInterval(showNext,3000);
    window.onresize = init;

    function init(){
        windowWidth = document.body.clientWidth;
        carousel.style.height = windowWidth / (640 / 200) + "px";
        for(var i = 0; i < carouselLi.length; i++){
            carouselLi[i].style.webkitTransform = "translateX("+ windowWidth +"px)"
        }
        chengPic();
    }

    carousel.addEventListener("touchstart", touchstarHandler, false);
    carousel.addEventListener("touchmove", touchmoveHandler, false);
    carousel.addEventListener("touchend", touchendHandler, false);

    var deltaX, startTime;
    function touchstarHandler(event){
        event.preventDefault();
        clearInterval(timer);
        if(event.touches.length > 1) return;
        carouselLi[next].style.transition = "none";
        carouselLi[idx].style.transition = "none";
        carouselLi[prev].style.transition = "none";
        deltaX = event.touches[0].clientX;
        startTime = new Date();
    }
    function touchmoveHandler(event){
        event.preventDefault();
        clearInterval(timer);
        if(event.touches.length > 1) return;
        var clientX = event.touches[0].clientX - deltaX;
        carouselLi[prev].style.webkitTransform = "translateX("+ (-windowWidth + clientX) +"px)";
        carouselLi[idx].style.webkitTransform = "translateX("+clientX+"px)";
        carouselLi[next].style.webkitTransform = "translateX("+ (windowWidth + clientX) +"px)";
    }
    function touchendHandler(event){
        event.preventDefault();
        var time = new Date() - startTime;
        var clientX = event.changedTouches[0].clientX - deltaX;
        if(clientX >= windowWidth / 2 || (time < 300 && clientX > 30)){
            showPrev();
        }else if(clientX <= -windowWidth / 2 || (time < 300 && clientX < -30)){
            showNext();
        }else{
            carouselLi[next].style.transition = "all 0.3s ease 0s";
            carouselLi[idx].style.transition = "all 0.3s ease 0s";
            carouselLi[prev].style.transition = "all 0.3s ease 0s";
            chengPic();
        }
        clearInterval(timer);
        timer = setInterval(showNext,3000);
    }
    function showNext() {
        prev = idx;
        idx = next;
        next++;
        if(next > carouselLi.length -1) next = 0;
        carouselLi[prev].style.transition = "all 0.3s ease 0s";
        carouselLi[idx].style.transition = "all 0.3s ease 0s";
        carouselLi[next].style.transition = "none";
        chengPic();
        setPoint();
    }
    function showPrev() {
        next = idx;
        idx = prev;
        prev--;
        if(prev < 0) prev = carouselLi.length -1;
        carouselLi[prev].style.transition = "none";
        carouselLi[next].style.transition = "all 0.3s ease 0s";
        carouselLi[idx].style.transition = "all 0.3s ease 0s";
        chengPic();
        setPoint();
    }
    function setPoint(){
        for(var i = 0; i < circles.length; i++){
            circles[i].className = '';
        }
        circles[idx].className = "cur";
    }
    function chengPic(){
        carouselLi[prev].style.webkitTransform = "translateX("+ -windowWidth +"px)";
        carouselLi[idx].style.webkitTransform = "translateX(0px)";
        carouselLi[next].style.webkitTransform = "translateX("+ windowWidth +"px)";
    }
    var seckillGoods = document.querySelector("#seckillGoods ul");
    function getHotGoods(page,pagesize) {
        var HotGoodsHtml = "";
        Ajax("GET","api_goods.php?page="+page+"&pagesize="+pagesize,"",function (response) {
            console.log(response);
            for(var i = 0; i < response.data.length; i++){
                var obj = response.data[i];
                HotGoodsHtml += "<li><i></i><a href='html/details.html?goods_id="+ obj.goods_id+"'><img src='"+ obj.goods_thumb +"' alt=''></a><div><span>￥"+ (parseInt(obj.price*0.8))+".99</span><span><del>￥"+ obj.price+"</del></span></div></li>"
            }
            seckillGoods.innerHTML = HotGoodsHtml;
        });
        console.log(HotGoodsHtml);
        console.log(seckillGoods);
        seckillCarousel();
    }
    getHotGoods(page,pagesize);
    var seckillTime = document.querySelector("#time");
    function p(n) {
        return n < 10 ? "0" + n : n;
    }
    var Time = "22";
    function newTimer(T){
        var Html = "";
        var startTimer = new Date();
        var endTime = new Date("2017/7/"+T+" 23:59:59");
        var countDown = (endTime.getTime() - startTimer.getTime())/1000;
        var oDay = parseInt(countDown/(24*60*60));
        var oHours = parseInt(countDown/(60*60)%24);
        var oMinutes = parseInt(countDown/60%60);
        var oSeconds = parseInt(countDown%60);
        Html = "<span>"+p(oHours)+"</span>:<span>"+ p(oMinutes)+"</span>:<span>"+ p(oSeconds)+"</span>";
        seckillTime.innerHTML = Html;
        if(countDown < 0){
            Time++;
            newTimer(Time);
            page++;
            getHotGoods(page,pagesize);
        }
    }
    var renovate = setInterval(function(){newTimer(Time)},1000);
    function seckillCarousel() {
        var deltaX;
        var nowx = 0;
        var movearr = [];
        var seckillWidth;
        seckillGoods.addEventListener("touchstart",function (event) {
            seckillWidth = seckillGoods.offsetWidth;
            // event.preventDefault();
            seckillGoods.style.transition = "none";
            deltaX = event.touches[0].clientX - nowx;
        },false);
        seckillGoods.addEventListener("touchmove",function(event){
            event.preventDefault();
            nowx = event.touches[0].clientX - deltaX;
            seckillGoods.style.left = nowx + "px";
            movearr.push(event.touches[0].clientX);
        },false);
        seckillGoods.addEventListener("touchend",function(event){
            // event.preventDefault();
            var s = movearr[movearr.length - 1] - movearr[movearr.length - 2];
            var targetx = nowx + s * 5;
            if(targetx >0){
                targetx = 0;
                seckillGoods.style.transition = 'all 0.4s cubic-bezier(0.15,0.85,0.15,2.08) 0s'
            }else if(targetx < -(seckillWidth-windowWidth)){
                targetx = -(seckillWidth-windowWidth);
                seckillGoods.style.transition = 'all 0.4s cubic-bezier(0.15,0.85,0.15,2.08) 0s'
            }else{
                seckillGoods.style.transition = 'all 0.4s cubic-bezier(0.18,0.68,0.65,0.00) 0s'
            }
            seckillGoods.style.left = targetx + 'px';
            nowx = targetx;
        },false);
    }
    //暂时
    var floorCarousel = document.querySelectorAll(".floorCarousel ul");
    var floorOffset = floorCarousel[0].offsetWidth/2;
    console.log(floorOffset);
    var lock0 = true;
    var lock1 = true;
    var lock2 = true;
    var lock3 = true;
    var floorTimer0 = setInterval(function () {
        if(lock0){
            floorCarousel[0].style.webkitTransform = "translateX("+-floorOffset+"px)";
            lock0 = false;
        } else{
            floorCarousel[0].style.webkitTransform = "translateX(0)";
            lock0 = true;
        }
    },5000);
    var floorTimer1 = setInterval(function () {
    if(lock1){
        floorCarousel[1].style.webkitTransform = "translateX("+-floorOffset+"px)";
        lock1 = false;
    } else{
        floorCarousel[1].style.webkitTransform = "translateX(0)";
        lock1 = true;
    }
    },5000);
    var floorTimer2 = setInterval(function () {
        if(lock2){
            floorCarousel[2].style.webkitTransform = "translateX("+-floorOffset+"px)";
            lock2 = false;
        } else{
            floorCarousel[2].style.webkitTransform = "translateX(0)";
            lock2 = true;
        }
    },5000);
    var floorTimer3 = setInterval(function () {
        if(lock3){
            floorCarousel[3].style.webkitTransform = "translateX("+-floorOffset+"px)";
            lock3 = false;
        } else{
            floorCarousel[3].style.webkitTransform = "translateX(0)";
            lock3 = true;
        }
    },5000);
    var HotHtml = "";
    var HotGoodsList = document.querySelector("#HotGoodsList ul");
    console.log(HotGoodsList);
    function HotGoods(page,pagesize) {
        Ajax("GET","api_goods.php?page="+page+"&pagesize="+pagesize,"",function (response) {
           console.log(response);
           for(var i = 0; i < response.data.length; i++) {
               var obj = response.data[i];
               HotHtml += "<li><a href=html/details.html?goods_id="+obj.goods_id+"><img src='" + obj.goods_thumb + "' alt=''><p>" + obj.goods_name + "</p><span>￥" + obj.price + "</span></a></li>"
           }
            HotGoodsList.innerHTML = HotHtml;
        });
    }
    HotGoods(page,pagesize);
    lazy();
    function lazy(){
        var page = 0;
        document.addEventListener("scroll",function () {
            var bodyHeight = document.body.scrollHeight;
            var windowHeight = document.documentElement.clientHeight;
            var sewheel = document.body.scrollTop;
            console.log(page);
            if(  bodyHeight !==0 && sewheel + windowHeight === bodyHeight){
               page++;
               if(page >= 10) return;
               console.log(page);
               HotGoods(page,pagesize);
            }
        })
    }
    goTop();
    function goTop(){
        var Top = document.querySelector("#Top");
        var sewheel;
        var timer;
        Top.addEventListener("touchstart",function(){
            sewheel = document.body.scrollTop;
            timer = setInterval(function(){
                sewheel -= 30;
             if(sewheel < 0){
                 sewheel = 0;
                 clearInterval(timer);
                 document.body.scrollTop = sewheel;
                 return;
             }else{
                 document.body.scrollTop = sewheel;
             }
            },5);
        })
    }
};