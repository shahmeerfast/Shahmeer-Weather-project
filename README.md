# Shahmeer-Weather-project

# Weather Dashboard

This is a Weather Dashboard application that allows users to view weather data for a city, view a forecast chart, and interact with a chatbot. The dashboard is built with HTML, Tailwind CSS, and Chart.js, and it fetches real-time weather data from the OpenWeather API.

## Features

- Weather Widget: Displays current weather conditions for a selected city.
- Forecast Charts: Includes bar, doughnut, and line charts to visualize temperature trends and weather conditions.
- Search Functionality: Allows users to search for weather data by city name.
- User Profile Section: Users can view and update their profile, including default city and theme preferences.
- Responsive Design: The layout adjusts for different screen sizes.
- Chatbot: An interactive chatbot to provide additional weather or general information based on current conditions.

## Technologies Used

- HTML: Structure of the application.
- Tailwind CSS: For styling and responsive design.
- Chart.js: For rendering weather forecast charts.
- OpenWeather API: To fetch real-time weather data.
- Google Gemini API: To power the chatbot.

## Prerequisites

To run the project locally, ensure you have the following:

- A modern web browser (Google Chrome, Mozilla Firefox, etc.).
- Internet connection to fetch weather data from the OpenWeather API and use the Google Gemini API for chatbot functionality.

## Instructions to Run Locally

1. Clone or Download the Project:
   - Clone the project using Git:
     ```bash
     git clone https://github.com/yourusername/weather-dashboard.git
     ```
   - Alternatively, download the project as a ZIP file and extract it to your local machine.

2. Open the Project:
   - Navigate to the project directory and locate the `index.html` file.

3. Open in Browser:
   - Simply double-click the `index.html` file to open it in your default browser.
   - Alternatively, you can drag the file into a browser window.

4. API Configuration:
   - The project uses the OpenWeather API to fetch real-time weather data. To use the app, ensure that your API key is inserted into the `API_KEY` variable in the script section of `index.html`. Replace the placeholder key with your actual API key:
     ```javascript
     const API_KEY = 'OPENWEATHER_API_KEY';
     ```

   - The project also uses the Google Gemini API for chatbot functionality. Replace the placeholder key in the script with your actual Gemini API key:
     ```javascript
     const GEMINI_API_KEY = 'GEMINI_API_KEY';
     ```

5. Enjoy the App:
   - You can now search for weather data by entering a city name in the search bar.
   - You can interact with the chatbot by typing a question or statement in the input field and clicking the Send button.

