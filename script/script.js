const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('#right-nav')

menu.addEventListener('click', function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})

fetch('https://mxrcxsz.github.io/asg2/db.json')
    .then(response => response.json()) 
    .then(function(data){
        for(var i = 0; i <= data.count; i++)
        {
            console.log(data[i]);
            console.log('hi');
        }
    });    