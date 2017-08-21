window.onload = function () {
    var videoBtn = document.querySelector(".page-1_videoBtn");
    var videoOne = document.querySelector("#video_1");
    var video2 = document.querySelector("#video_2");
    var pageBtn = document.querySelector(".pageBtn");
    var videoBtn2 = document.querySelector(".page-2_videoBtn")
        var mySwiper = new Swiper('.swiper-container', {
            onSlideChangeStart : function (swiper) {
                videoOne.pause();
                video2.pause();
                if(mySwiper.realIndex > 0 && mySwiper.realIndex < 5){
                    pageBtn.style.animationDirection = "alternate";
                }else{
                    pageBtn.style.animationDirection = "normal";
                }
        },
            onInit: function(swiper){  //Swiper2.x的初始化是onFirstInit
                swiperAnimateCache(swiper);  //隐藏动画元素
                setTimeout(function(){ //2s后开始运行动画（移动端总是没加载完图片就开始动画了。。。。。）
                    swiperAnimate(swiper); //初始化完成开始动画
                },2000)
            },
            onSlideChangeEnd:function (swiper) {
            swiperAnimate(swiper);
        }
    });
    videoBtn.addEventListener("touchstart", function () {
        if (videoOne.paused) {
            videoOne.play()
        } else {
            videoOne.pause();
        }
    })
    videoBtn2.addEventListener("touchstart", function () {
        if (video2.paused) {
            video2.play()
        } else {
            video2.pause();
        }
    })
}
