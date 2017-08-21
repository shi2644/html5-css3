var goodsList = document.querySelector("#goodsList");
var classify = document.querySelector("#classify");
var bodyContainer = document.querySelector("#bodyContainer");
Ajax("GET","api_cat.php","",function (response) {
    console.log(response);
    var oUl = document.createElement("ul");
    var html = "";
    for(var i = 0; i < response.data.length; i++){
        var obj = response.data[i];
        html += "<li><a href='html/list.html?cat_id="+ obj.cat_id +"'>"+obj.cat_name+"</a></li>";
    }
    oUl.innerHTML = html;
    goodsList.appendChild(oUl);
});
var lock = true;
classify.addEventListener("touchstart",function (event) {
    event.stopPropagation();

    if (lock) {
        bodyContainer.style.webkitTransform = "translateX(30%)";
        lock = false;
    } else {
        bodyContainer.style.webkitTransform = "translateX(0)";
        lock = true;
    }
});
bodyContainer.addEventListener("touchstart",function (event) {
    function init() {
        if(!lock){
            // event.preventDefault();
            bodyContainer.style.webkitTransform = "translateX(0)";
        }
    }
    init();
    bodyContainer.addEventListener("touchend",function (event){
        if(lock){
            bodyContainer.removeEventListener('touchstart',init);
        }
    })
});

