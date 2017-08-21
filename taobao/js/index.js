window.onload = function () {
    var carousel = document.querySelector(".carousel");
    var imageLi = document.querySelectorAll(".inner-c ul li");
    var circles = document.querySelectorAll(".circles li");
    var windowWidth;
    var next = 1;
    var idx = 0;
    var prev = imageLi.length - 1;
    console.log(imageLi);
    init();
    var timer = setInterval(function () {
        showNext();
    },3000);
    for(var i = 0; i < circles.length; i++) {
        (function (i) {
            circles[i].addEventListener("touchstart",function () {
                clearInterval(timer);
                setCurrentImage(i);
            }, false);
        })(i);
    }
    function setCurrentImage(i){
        idx = i;
        prev = idx - 1;
        if(prev === -1){
            prev = circles.length -1;
        }
        next = idx + 1;
        if(next > circles.length-1) next = 0;
        init();
        clearInterval(timer);
        timer = setInterval(function () {
            showNext();
        },3000);
    }
    window.onresize = init;
    function init() {
        windowWidth = document.body.clientWidth;
        carousel.style.height = windowWidth / (640 / 200) + "px";
        for (var i = 0; i < imageLi.length; i++) {
            console.log(windowWidth);
            imageLi[i].style.webkitTransform = "translateX(" + windowWidth + "px)";
        }
        chengPic();
        setPoint();
    }
    carousel.addEventListener("touchstart", touchstarHandler, false);
    carousel.addEventListener("touchmove", touchmoveHandler, false);
    carousel.addEventListener("touchend", touchendHandler, false);
    var deltaX, startTime;
    function touchstarHandler(event) {
        event.preventDefault();
        clearInterval(timer);
        if(event.touches.length > 1) return;
        imageLi[next].style.transition = "none";
        imageLi[idx].style.transition = "none";
        imageLi[prev].style.transition = "none";
        deltaX = event.touches[0].clientX;
        startTime = new Date();
    }
    function touchmoveHandler(event){
        event.preventDefault();
        clearInterval(timer);
        if(event.touches.length > 1) return;
        var clientX = event.touches[0].clientX - deltaX;
        imageLi[next].style.webkitTransform = "translateX("+ (windowWidth+clientX) +"px)";
        imageLi[idx].style.webkitTransform = "translateX("+clientX+"px)";
        imageLi[prev].style.webkitTransform = "translateX("+(-windowWidth+clientX)+"px)";
    }
    function touchendHandler(event){
        event.preventDefault();
        var time = new Date() - startTime;
        var clientX = event.changedTouches[0].clientX - deltaX;
        console.log(time,clientX);
        if(clientX >= windowWidth/2 || (time < 300 && clientX > 30)){
            console.log("右划成功");
            showPrev();
        }else
        if(clientX <= -windowWidth/2 || (time < 300 && clientX < -30)){
            console.log("左划成功");
            showNext();
        }else{
            console.log("滑动失败");
            imageLi[prev].style.transition = "all 0.3s ease 0s";
            imageLi[idx].style.transition = "all 0.3s ease 0s";
            imageLi[next].style.transition = "all 0.3s ease 0s";
            imageLi[next].style.webkitTransform = "translateX("+ windowWidth +"px)";
            imageLi[idx].style.webkitTransform = "translateX(0px)";
            imageLi[prev].style.webkitTransform = "translateX("+(-windowWidth)+"px)";
        }
        clearInterval(timer);
        timer = setInterval(function () {
            showNext();
        },3000);
    }
    function showNext() {
        prev = idx;
        idx = next;
        next++;
        if(next > imageLi.length -1) next = 0;
        imageLi[prev].style.transition = "all 0.3s ease 0s";
        imageLi[idx].style.transition = "all 0.3s ease 0s";
        imageLi[next].style.transition = "none";
        chengPic();
        setPoint()
    }
    function showPrev() {
        next = idx;
        idx = prev;
        prev--;
        if(prev < 0) prev = imageLi.length -1;
        imageLi[prev].style.transition = "none";
        imageLi[next].style.transition = "all 0.3s ease 0s";
        imageLi[idx].style.transition = "all 0.3s ease 0s";
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
        imageLi[prev].style.webkitTransform = "translateX("+ -windowWidth +"px)";
        imageLi[idx].style.webkitTransform = "translateX(0px)";
        imageLi[next].style.webkitTransform = "translateX("+ windowWidth +"px)";
    }
};
