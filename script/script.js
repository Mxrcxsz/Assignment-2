const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('#right-nav')

menu.addEventListener('click', function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})


var path = window.location.pathname;
var page = path.split("/").pop();
console.log(page);

//Fetch Data
function fetchTop(url,number){
    fetch(url)
    .then(response => response.json()) 
    .then(function(data){

    for(var i = 0; i<data.top.length; i++)
    {
        console.log(data.top[i]);
        var onclick;
        if(number == 1){
            onclick = 'onclick="showDetails(' + "'Anime'," + data.top[i].mal_id + ')"';
        }
        else{
            onclick = 'onclick="showDetails(' + "'Manga'," + data.top[i].mal_id + ')"';
        }
        $("#flex-container" + number).append("<div class='flex-items'><a href='details.html'" + onclick + "><div class='flex-items-container'><div class='imgContainer'><img src=" + data.top[i].image_url + "></div><article><div class='description'></div></article></div><p>" + data.top[i].title + "</p></a></div>");
    }
    });
}

let topAnimeUrl = 'https://api.jikan.moe/v3/top/anime/1/tv';
let topMangaUrl = 'https://api.jikan.moe/v3/top/manga/1/manga';

if(page == "index.html"){
    let z = document.getElementById("flex-container1");
    let y = document.getElementById("flex-container2");
    let yc = document.getElementById("manga");
    let zc = document.getElementById("anime");
    var check = true;
    var a = 2;
    var m = 2;
    y.style.display = "none"

    fetchTop(topAnimeUrl,1)
    fetchTop(topMangaUrl,2)

    //show anime
    function showAnime(){
        y.style.display = "none";
        z.style.display = "flex";
        if (check == false)
        {
            zc.style.backgroundColor = "#00f7ff";
            yc.style.backgroundColor = "#152238";
            check = true;
        }
    }

    //show manga
    function showManga(){
        z.style.display = "none";
        y.style.display = "flex";
        if (check == true)
        {
            yc.style.backgroundColor = "#00f7ff";
            zc.style.backgroundColor = "#152238";
            check = false;
        }
    }

    $(window).scroll(function() {
        if($(window).scrollTop() == $(document).height() - $(window).height()) {
            if(check == true){
                fetchTop("https://api.jikan.moe/v3/top/anime/" + a + "/tv",1);
                a+=1;
            }
            else{
                fetchTop("https://api.jikan.moe/v3/top/manga/" + m + "/manga",2);
                m+=1;
            }
        }
    });

    function showDetails(type, id){
        let ID = [type, id]
        sessionStorage.setItem("ID",JSON.stringify(ID));
    }
}
if(page == "details.html"){
    id = JSON.parse(sessionStorage.getItem("ID"))
    $('#title').html(id[1])
}