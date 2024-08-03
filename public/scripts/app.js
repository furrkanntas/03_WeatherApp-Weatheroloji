import Forecast from "./forecast.js";

const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const forecast = new Forecast();

const loadAdviseData = async () => {
    const response = await fetch('./advise.json');
    const data = await response.json();
    return data;
};

const updateUI = async (data) => {
    const { cityDets, weather, timezone, dailyForecast } = data;

    const adviceData = await loadAdviseData();

    const now = new Date();
    const formattedDay = dateFns.format(now, 'EEEE');
    const formattedDate = dateFns.format(now, 'dd MMM yyyy');
    const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone.Name }));

    details.innerHTML = `
        <div class="flex flex-row items-center justify-center pl-3">
            <i class="fa-solid fa-calendar-days text-2xl"></i>
            <div class="w-[2px] h-8 bg-yellow-500 mx-1"></div>
            <div class="flex flex-col justify-start items-start pl-1">
                <div class="text-xl font-bold">${formattedDay}</div>
                <div class="text-sm font-semibold">${formattedDate}</div>
            </div>
            <div class="flex flex-row justify-center items-center pl-5">
                <i class="fa-solid fa-clock"></i>
                <div class="pl-1">${dateFns.format(localTime, 'HH:mm:ss')}</div>
            </div>
        </div>
        <div class="flex flex-row justify-center items-center pt-5">
            <i class="fa-solid fa-location-dot text-xl"></i>
            <h5 class="pl-1 text-2xl font-bold">${cityDets.EnglishName}</h5>
        </div>
        <div class="text-4xl font-bold mt-4">
            <span>${Math.round(weather.Temperature.Metric.Value)}</span>
            <span>&deg;C</span>
        </div>
        <div class="mt-4">
            <img class="bg-yellow-500/40 rounded-full mx-auto icon" src="img/icons/${weather.WeatherIcon}.svg" alt="">
        </div>
        <div class="flex flex-row justify-center items-center mt-4">
            <i class="fa-solid fa-comment"></i>
            <div class="font-semibold pl-1">${weather.WeatherText}</div>
        </div>
    `;

    const dailyNote = document.getElementById('dailyNote');
    const advice = adviceData[weather.WeatherText] || "No advice available for this weather condition.";
    dailyNote.textContent = advice;

    const iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
    const iconElement = document.querySelector('.details .icon');
    if (iconElement) {
        iconElement.setAttribute('src', iconSrc);
    } else {
        console.error('Icon element not found');
    }

    if (weather.IsDayTime) {
        card.classList.add("bg-[url('img/day.svg')]", "text-black");
        card.classList.remove("bg-[url('img/night.svg')]", "text-white");
    } else {
        card.classList.add("bg-[url('img/night.svg')]", "text-white");
        card.classList.remove("bg-[url('img/day.svg')]", "text-black");
    }

    if (card.classList.contains('hidden')) {
        card.classList.remove('hidden');
    }

    const daysArray = document.querySelectorAll('.days');

    daysArray.forEach((day, i) => {
        day.children[0].textContent = dateFns.format(dateFns.addDays(now, i+1), 'EEEE');
        day.children[2].children[0].textContent = Math.round(dailyForecast[i+1].Temperature.Minimum.Value);
        day.children[2].children[2].textContent = Math.round(dailyForecast[i+1].Temperature.Maximum.Value);
    
        day.children[1].src = `img/icons/${dailyForecast[i+1].Day.Icon}.svg`;

    })
};

cityForm.addEventListener('submit', e => {
    e.preventDefault();

    const city = cityForm.city.value.trim();
    cityForm.reset();

    forecast.updateCity(city)
        .then(data => {
            updateUI(data);
        })
        .catch(err => console.log(err));

    localStorage.setItem('city', city);
});

if (localStorage.getItem('city')) {
    forecast.updateCity(localStorage.getItem('city'))
        .then(data => updateUI(data))
        .catch(err => console.log(err));
}