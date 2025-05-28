// Constants
const VALID_USERNAME = "Naveen";
const VALID_PASSWORD = "123";

// Session expiry: 29 May 2025, 19:30 (7:30 PM)
const SESSION_EXPIRY = new Date("2025-06-23T20:45:00");

// Check login session on all pages
function isSessionValid() {
  const session = JSON.parse(localStorage.getItem("sessionData"));
  if (!session) return false;

  const now = new Date();
  if (now > SESSION_EXPIRY) {
    // Expired session, clear storage
    localStorage.removeItem("sessionData");
    return false;
  }
  // Check username and expiry
  if (session.username === VALID_USERNAME && new Date(session.expiry) > now) {
    return true;
  }
  return false;
}

// Save session on login
function saveSession() {
  const expiry = SESSION_EXPIRY.toISOString();
  localStorage.setItem(
    "sessionData",
    JSON.stringify({
      username: VALID_USERNAME,
      expiry,
    })
  );
}

// Redirect helpers
function redirectToVideos() {
  window.location.href = "videos.html";
}

function redirectToLogin() {
  window.location.href = "index.html";
}

// Login page logic
function loginPage() {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  if (isSessionValid()) {
    redirectToVideos();
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      saveSession();
      redirectToVideos();
    } else {
      errorMsg.textContent = "❌ Invalid username or password!";
    }
  });
}

// Videos page logic
function videosPage() {
  if (!isSessionValid()) {
    redirectToLogin();
    return;
  }
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("sessionData");
    redirectToLogin();
  });
}

// Video player page logic
function videoPage() {
  if (!isSessionValid()) {
    redirectToLogin();
    return;
  }

  const videoContainer = document.getElementById("videoContainer");
  const backBtn = document.getElementById("backBtn");

  const urlParams = new URLSearchParams(window.location.search);
  const part = urlParams.get("part");

  const videos = {
    1: 'https://player.vimeo.com/video/1086712834?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    2: 'https://player.vimeo.com/video/1086712834?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    3: 'https://player.vimeo.com/video/1087925125?h=6612f2ca4c&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
  };

  if (!videos[part]) {
    videoContainer.innerHTML = "<p style='color:#ff4d6d; font-weight:bold;'>❌ Invalid video part.</p>";
    return;
  }

  videoContainer.innerHTML = `<iframe src="${videos[part]}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Maths Part ${part}"></iframe>`;

  backBtn.addEventListener("click", () => {
    window.location.href = "videos.html";
  });
}

// Run the proper page logic
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("loginForm")) {
    loginPage();
  } else if (document.getElementById("logoutBtn")) {
    videosPage();
  } else if (document.getElementById("videoContainer")) {
    videoPage();
  }
});
