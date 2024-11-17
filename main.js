const apiKey = "d13e35e3b21eecf335adb25971170569";

const inspirationQuotes = [
  "The best way to predict the future is to create it.",
  "You are never too old to set another goal or to dream a new dream.",
  "Success is not the key to happiness. Happiness is the key to success.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
];

const backgrounds = [
  "https://images.unsplash.com/photo-1731432245325-d820144afe4a?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1725603080015-7d16a86c45d9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1727259066904-a7a1e43c6a5d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1726828581304-1bd8a2b90246?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1624062999490-6218fc60e4f3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * inspirationQuotes.length);
  return inspirationQuotes[randomIndex];
}

function setRandomBackground() {
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  document.body.style.backgroundImage = `url('${backgrounds[randomIndex]}')`;
}

function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  clock.innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

const loginButton = document.getElementById("loginButton");
const usernameInput = document.getElementById("username");
const greeting = document.getElementById("greeting");
const weatherArea = document.getElementById("weatherArea");
const todoArea = document.getElementById("todoArea");
const inspiration = document.getElementById("inspiration");

loginButton.addEventListener("click", () => {
  const username = usernameInput.value;
  if (username) {
    localStorage.setItem("username", username);
    updateGreeting();
    resetApp();
  } else {
    alert("Please enter your name.");
  }
});

function updateGreeting() {
  const username = localStorage.getItem("username");
  if (username) {
    greeting.innerText = `Hello, ${username}!`;
    greeting.classList.remove("hidden");
    document.getElementById("loginArea").classList.add("hidden");
    weatherArea.classList.remove("hidden");
    todoArea.classList.remove("hidden");
    inspiration.classList.remove("hidden");
    showInspiration();
  }
}

function resetApp() {
  getWeather();
  loadTodos();
  setRandomBackground();
}

function getWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeather, handleError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function handleError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

function showWeather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weatherInfo = document.getElementById("weatherInfo");
      weatherInfo.innerHTML = `Location: ${data.name} <br> Temperature: ${data.main.temp}°C <br> Weather: ${data.weather[0].description}`;
      document.getElementById("weatherArea").classList.remove("hidden");
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert(
        "Unable to retrieve weather data. Please check your location settings."
      );
    });
}

const todoInput = document.getElementById("todoInput");
const addTodoButton = document.getElementById("addTodoButton");
const todoList = document.getElementById("todoList");

addTodoButton.addEventListener("click", addTodo);

function addTodo() {
  const todoText = todoInput.value;
  if (todoText) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push(todoText);
    localStorage.setItem("todos", JSON.stringify(todos));
    loadTodos();
    todoInput.value = "";
  }
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.innerText = todo;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.style.marginLeft = "10px";
    deleteButton.onclick = () => {
      todos.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      loadTodos();
    };

    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

function showInspiration() {
  const quote = getRandomQuote();
  inspiration.innerText = quote;
  inspiration.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  setRandomBackground();
  const username = localStorage.getItem("username");
  if (username) {
    updateGreeting();
    getWeather();
    loadTodos();
  } else {
    document.getElementById("loginArea").classList.remove("hidden");
  }
  updateClock();
});
