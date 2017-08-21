window.onload = function () {
    var mySwiper = new Swiper('.swiper-container',{
        direction:"vertical",
        loop: true,
        onInit:function (swiper) {
            swiperAnimateCache(swiper);
            swiperAnimate(swiper);
        },
        onSlideChangeEnd:function (swiper) {
            swiperAnimate(swiper);
        }
    });
    var logo = document.querySelector(".logo");
    var Alert = document.querySelector(".Alert");
    var section = document.querySelector(".section");

    var imagecount = 0;
    var newImage = new Image();
    newImage.src = 'images/1.png';
    newImage.onload = function(){
        imagecount++;
        if (imagecount >= 10) {
            fn();
        }
    }
    var i = 0;
    var timer;
    var btn = document.getElementById("btn");
    timer = setInterval(function () {
        i++;
        newImage.src = 'images/'+i+'.png';

        if(i >= 101) {
            clearInterval(timer);
            Alert.style.backgroundImage = "url(images/82c9f3_640_1040.png)";
            btn.style.display = "block";
            section.style.animationName = "roll";
            section.style.animationDuration = "10s";
            section.style.animationFillMode = "forwards";
            section.style.animationPlayState = "paused";
        }
    },5);
    btn.addEventListener("touchstart",function () {
        console.log(3);
        Alert.style.backgroundImage = "none";
        section.style.animationPlayState = "running";
        btn.addEventListener("touchend",function () {
            Alert.style.backgroundImage = "url(images/alert.png)";
            console.log(4);
            section.style.animationPlayState = "paused";
        })
    })
    section.addEventListener("webkitAnimationEnd",function () {
        Alert.remove();
        logo.style.zIndex = "1000";
        logo.style.animationName = "zoomIn";
        logo.style.animationDuration = "2s";
    });
    Pace.stop();
    document.querySelector(".back").remove();
};