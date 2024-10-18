
const API_KEY = '69acf068a558d0120e4ce7a9f71bb4df';
const GEMINI_API_KEY = 'AIzaSyBwFchHNMo_9OyasOUfY0AnUfR5V-z4WvM';

let barChart, doughnutChart, lineChart;
let currentWeatherData = null;

function initCharts() {
    const barCtx = document.getElementById('tempBarChart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '5-Day Temperature',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                delay: (context) => context.dataIndex * 100
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const doughnutCtx = document.getElementById('weatherDoughnutChart').getContext('2d');
    doughnutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ]
            }]
        },
        options: {
            animation: {
                delay: (context) => context.dataIndex * 100
            }
        }
    });

    const lineCtx = document.getElementById('tempLineChart').getContext('2d');
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature Trend',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4
            }]
        },
        options: {
            animation: {
                y: {
                    duration: 2000,
                    easing: 'easeOutBounce'
                }
            }
        }
    });
}

async function fetchWeatherData(city) {
    try {
        const units = document.getElementById('unitToggle').value;
        
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${API_KEY}`
        );
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        currentWeatherData = currentData;
        updateWeatherDisplay(currentData);
        updateCharts(forecastData);
        updateWeatherTable(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        document.getElementById('cityName').textContent = 'City not found';
    }
}

function updateWeatherDisplay(data) {
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;

    
    const weatherWidget = document.getElementById('weatherWidget');
    weatherWidget.classList.remove('clear', 'clouds', 'rain');
    if (data.weather[0].main.toLowerCase().includes('clear')) {
        weatherWidget.classList.add('clear');
    } else if (data.weather[0].main.toLowerCase().includes('cloud')) {
        weatherWidget.classList.add('clouds');
    } else {
        weatherWidget.classList.add('rain');
    }
}

function updateCharts(forecastData) {
    // Bar Chart
    const temperatures = forecastData.list.slice(0, 5).map(item => item.main.temp);
    const dates = forecastData.list.slice(0, 5).map(item => 
        new Date(item.dt * 1000).toLocaleDateString()
    );

    barChart.data.labels = dates;
    barChart.data.datasets[0].data = temperatures;
    barChart.update();

    //  Doughnut Chart
    const weatherTypes = {};
    forecastData.list.forEach(item => {
        const type = item.weather[0].main;
        weatherTypes[type] = (weatherTypes[type] || 0) + 1;
    });

    doughnutChart.data.labels = Object.keys(weatherTypes);
    doughnutChart.data.datasets[0].data = Object.values(weatherTypes);
    doughnutChart.update();

    // Line Chart
    const hourlyTemps = forecastData.list.slice(0, 8).map(item => item.main.temp);
    const hours = forecastData.list.slice(0, 8).map(item => 
        new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })
    );

    lineChart.data.labels = hours;
    lineChart.data.datasets[0].data = hourlyTemps;
    lineChart.update();
}

function updateWeatherTable(forecastData) {
    const tableBody = document.getElementById('weatherTableBody');
    tableBody.innerHTML = '';

    forecastData.list.forEach(item => {
        const row = document.createElement('tr');
        const date = new Date(item.dt * 1000);
        
        row.innerHTML = `
            <td class="px-4 py-2">${date.toLocaleDateString()}</td>
            <td class="px-4 py-2">${date.toLocaleTimeString()}</td>
            <td class="px-4 py-2">${Math.round(item.main.temp)}°</td>
            <td class="px-4 py-2">${item.weather[0].description}</td>
            <td class="px-4 py-2">${item.main.humidity}%</td>
            <td class="px-4 py-2">${item.wind.speed} m/s</td>
            <td class="px-4 py-2">${item.main.pressure} hPa</td>
        `;
        tableBody.appendChild(row);
    });
}

// Chat functionality
async function handleChat(message) {
    const chatMessages = document.getElementById('chatMessages');
    

    const userDiv = document.createElement('div');
    userDiv.className = 'mb-2';
    userDiv.innerHTML = `<p class="bg-blue-100 p-2 rounded inline-block">You: ${message}</p>`;
    chatMessages.appendChild(userDiv);

    try {
        const weatherContext = currentWeatherData ? 
            `Current weather in ${currentWeatherData.name}: ${currentWeatherData.main.temp}°, ${currentWeatherData.weather[0].description}` :
            'No weather data available';

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Context: ${weatherContext}\nUser: ${message}\nProvide a helpful response about the weather or related topic.`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;

        const botDiv = document.createElement('div');
        botDiv.className = 'mb-2';
        botDiv.innerHTML = `<p class="bg-gray-100 p-2 rounded inline-block">Assistant: ${botResponse}</p>`;
        chatMessages.appendChild(botDiv);

    } catch (error) {
        console.error('Chat error:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mb-2';
        errorDiv.innerHTML = `<p class="bg-red-100 p-2 rounded inline-block">Error: Could not get response</p>`;
        chatMessages.appendChild(errorDiv);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    
    
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${sectionId}Section`).classList.add('active');
        });
    });

    // Search
    document.getElementById('searchButton').addEventListener('click', () => {
        const city = document.getElementById('citySearch').value;
        if (city) {
            fetchWeatherData(city);
        }
    });

    // Chat
    document.getElementById('sendMessage').addEventListener('click', () => {
        const input = document.getElementById('chatInput');
        if (input.value.trim()) {
            handleChat(input.value);
            input.value = '';
        }
    });

    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            handleChat(e.target.value);
            e.target.value = '';
        }
    });

    // Profile Form
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            defaultCity: document.getElementById('defaultCity').value,
            defaultUnit: document.getElementById('defaultUnit').value,
            theme: document.querySelector('input[name="theme"]:checked').value
        };
        
        
        if (formData.theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        
        document.getElementById('usernamePreview').textContent = formData.username;
        
        
        console.log('Profile updated:', formData);
    });

    
    fetchWeatherData('London');
});
