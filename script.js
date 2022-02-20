//_______________________Weather information____________________________


//_____________________________ Elements________________________________

// Основные блоки

let main = document.querySelector('#main');

let box = document.querySelector('#container');

let selector1 = document.querySelector('#countrySelect');

let selector2 = document.querySelector('#citySelect');

let selector3 = document.querySelector('#favour');

let infoBlock1 = document.querySelector('#info1');

let infoBlock2 = document.querySelector('#info2');

let infoBlock3 = document.querySelector('#info3');



// Боковая панель

let navigate_panel = document.getElementById('navigate');

// Селектор с названиями стран

let select1 = document.createElement('select');

select1.id = 'select';

select1.style = 'width: 20px; height: 25px; margin-top: 5px;';

selector1.innerHTML += `<label for="select">Выберите страну:</lable> <br>`;

selector1.append(select1);

// Данные из html-таблицы
let tabs = document.querySelectorAll('td');
let countries = [], country_code ='';

for(let i = 0; i < tabs.length; i += 8){

    countries.push([tabs[i].textContent, tabs[i+3].textContent]);
    
}

for(let i = 0; i < countries.length; i++){

    select1.append(new Option(countries[i][0], countries[i][1]));
}
//console.log(countries);


// Инпут выбора страны

let chose_country = document.createElement('input');
chose_country.style = 'width: 100px; height: 20px; margin-left: 5px';
selector1.append(chose_country);

let hint = document.createElement('div');
hint.style = `height: 20px; width: 100px; margin-left: 35px; color: darkblue;`;
selector1.append(hint);



// Инпут выбора города

let search = document.createElement('input');

search.type = 'text';
search.id = 'chose_city';


selector2.innerHTML += `<br> <label for="chose_city">Укажите город:</lable> <br>`;


search.style = `width: 125px; margin-top: 5px; height: 20px`;

selector2.append(search);

// Кнопка ввода

let btn = document.createElement('button');
btn.innerHTML = 'Ввод';
btn.style.marginLeft = '5px';
selector2.append(btn);


// Селект с избранными городами
let select2 = document.createElement('select');
select2.style = `width: 150px; height: 25px`;
selector3.append(select2);

let cities = {
    Дубна : 564719,
    Чернобыль : 710403,
    Фукусима : 2112923,
    Арзамас : 580724
}
function select2Allremove(){
    for(let key in cities){
        select2.remove(new Option(key, cities[key]));
    }

}
function select2refresh(){
    for(let key in cities){
        select2.append(new Option(key, cities[key]));
    }
    select2.value = '';
}

select2refresh();

// События

// Выбор значения из селекта

select1.onchange = () =>{

    for(let i = 0; i < countries.length; i++ ){

        if(select1.value == countries[i][1]){ 
         chose_country.value = countries[i][0];
         if(countries[i][1]) country_code = `,${countries[i][1]}`;
             else country_code = '';
        }
    }
    select2.value = '';

}


// Клик по подсказке под инпутом ввода названия страны

hint.addEventListener('click', () =>{

    chose_country.value = hint.innerHTML;
    hint.innerHTML = '';
    select2.value = '';
})



// Ввод в инпут выбора страны

chose_country.addEventListener('input', ()=>{
    

    for(let i = 0; i < countries.length; i++){
        for(let k = 0; k < countries[i][0].length; k++){
            let x = chose_country.value.length, y = chose_country.value.slice(0,x),
            z = countries[i][0].slice(0, x);
            if(y == z || y == z.toLowerCase()){ 
             hint.innerHTML = countries[i][0];
             if(countries[i][1]) country_code = `,${countries[i][1]}`;
            
            }
        }
    }
    select2.value = '';


})

// Ввод названия города

search.addEventListener('input', () =>{
    select2.value = '';
})

// Запрос погоды

// Ключи

let key1 = 'b6904de742205e61ca3e0e55fcadd91a';
let key2 = 'f3c8a9438497886b2c06308bc4903cd0';

// Нажатие кнопки "Ввод"

btn.addEventListener('click', () =>{

    // При использовании глобального поиска передаётся название города и сокращённое название страны
    req('q=',search.value, country_code);
    console.log(country_code);

});

// Выбор из списка избранного

select2.addEventListener('input', () =>{
    req('id=', select2.value, '');
    select1.value = '';
    chose_country.value = '';
    search.value = '';
    console.log(select2.value);
})

// Функция запроса
function req(reqType, val, code){
    fetch(`http://api.openweathermap.org/data/2.5/weather?${reqType}${val}${code}&lang=ru&units=metric&appid=${key1}`)
    .then(res =>{ return res.json()})
    .then(getWeather)
}

// Функция вывода информации о погоде

function getWeather(data){
    // Предварительная очистка информационных блоков
    
    document.querySelector('#cityName').innerHTML ='';
    infoBlock1.innerHTML = '';
    infoBlock2.innerHTML = '';
    infoBlock3.innerHTML = '';

    // Получение названия города
    
    let DN = data.name, DID = data.id;
    document.querySelector('#cityName').innerHTML = `<h1><center>${data.name}</center></h1>`;

    // Значок избранного
    
    let favAdd = document.createElement('span');
    document.querySelector('#cityName').append(favAdd);
    favAdd.innerHTML = `<h1>&#9733</h1>`;
    console.log(cities);

    // Если не найден город
    
    if(DN == undefined)  document.querySelector('#cityName').innerHTML = `<h1><center>Упс! Кажется, что-то пошло не так...</center></h1>`;

    // Если название города есть в списке селекта с избранными городами,
    // значок(звезда) будет желтой; если нет - черной;
    
    if(Object.values(cities).includes(data.id)){
        favAdd.style.color = 'gold';
       
    }
    else{ 
        favAdd.style.color = 'black';
        
        }


    // Клик по звездочке. Если город есть в селекте - удаляет; если нет - добавляет;
    
    favAdd.onclick =()=>{
        if(Object.values(cities).includes(data.id)){
            select2Allremove();
            for(let key in cities){
                if(cities[key] == DID) delete cities[key];
            }
            favAdd.style.color = 'black';
            select2refresh();
            return;
        }
        else{
            select2Allremove();
            cities[DN] = DID;
            favAdd.style.color = 'gold';
            select2refresh();
            return;
        }
        }
              

    // Температура

    infoBlock1.innerHTML = '';
    infoBlock1.innerHTML += `<h3><center>Температура:</center></h3><p><h1><center>${Math.round(data.main.temp)}&deg</center> </h1><p>`;
    infoBlock1.innerHTML += `<p><center>(Ощущается как: ${Math.round(data.main.feels_like)}&deg)</center><p>`;

    // Давление, общая информация.

    infoBlock2.innerHTML += `<h3>Атмосферное давление:</h3> <p><h1><center>${Math.round(data.main.pressure*0.75)}мм</center></h1></p>`;
    infoBlock2.innerHTML += `<p>${data.weather[0].description}</p>`;
    let iconBlock = document.createElement('span');
    iconBlock.classList.add('icon');
    infoBlock2.append(iconBlock);

    // Иконка погоды

    iconBlock.innerHTML += ` <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=""> `

    // Ветер

    infoBlock3.innerHTML += `<h3><center>Ветер:<center></h3> <p>Скорость: ${Math.floor(data.wind.speed)}-${Math.ceil(data.wind.speed)}м/с<p>`;
    let gust = data.wind.gust;
    if(gust){
    infoBlock3.innerHTML += `<p>Порывы: ${Math.floor(data.wind.gust)}-${Math.ceil(data.wind.gust)}м/с <p>`;
    }

    
    // Указатель текущего направления ветра

    let compass = document.createElement('div');
    compass.classList.add('compass');
    infoBlock3.append(compass);

    let arrowComp = document.createElement('span');
    arrowComp.classList.add('arrow');
    compass.append(arrowComp);

    let arrowHead = document.createElement('h3');
    arrowHead.classList.add('arrowHead');
    arrowHead.innerHTML = `<h3>&#10148</h3>`
    arrowComp.append(arrowHead);

    let n_s = document.createElement('span');
    n_s.classList.add('NS');
    n_s.innerHTML = `<h2 style="color: blue;">N</h2><br><br><h2 style="color: red;">S</h2>`;
    compass.append(n_s);

    let windDir = data.wind.deg;
    arrowComp.style.transform = `rotate(${windDir}deg)`;

    console.log(data);

}


   