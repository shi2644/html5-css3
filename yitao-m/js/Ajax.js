function Ajax(type,url,data,fn){
    var _$ = "http://h6.duchengjiu.top/shop/";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if(typeof fn === "function"){
                var response = JSON.parse(xhr.responseText);
                fn(response);
            }
        }
    };
    if(type === "GET"){
        xhr.open("GET",_$+url);
        xhr.send(null);
    }
    if(type === "POST"){
        xhr.open("POST",_$+url,true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(data);
    }

}
function getQueryString(name) {
        var search = location.search.substr(1);
        var reg = new RegExp('(&|^)'+name+'=([^&]*)(&|$)');
        var r = search.match(reg);
        if (r === null) return null;
        return decodeURI(r[2]);
}
