const usernames = [
  "noob_ace",
  "anonymusic",
  "zendovo",
  "sansi03",
  "yeah_right",
  "f20220590",
  "user2802i"
];

const multiplier = 4;

// Create and inject widget
const widget = document.createElement("div");
widget.id = "leetcode-widget";
document.body.appendChild(widget);

// Toggle minimize on click
widget.addEventListener("click", () => {
  widget.classList.toggle("minimized");
});

// Fetch today's solved count for a user
async function fetchTodaySolvedCount(username) {
  const url = "https://leetcode.com/graphql";
  const query = {
    operationName: "getRecentSubmissions",
    query: `
      query getRecentSubmissions($username: String!) {
        recentAcSubmissionList(username: $username) {
          id
          timestamp
        }
      }
    `,
    variables: { username }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });

    const data = await res.json();
    const submissions = data.data.recentAcSubmissionList;

    const today = new Date().toDateString();
    const countToday = submissions.filter(sub => {
      const subDate = new Date(parseInt(sub.timestamp) * 1000).toDateString();
      return subDate === today;
    }).length;

    return { username, solvedToday: countToday };
  } catch (e) {
    return { username, solvedToday: "❌ error" };
  }
}

// Render widget content
function renderWidget(userCounts) {
  if (widget.classList.contains("minimized")) return;

  const now = new Date().toLocaleTimeString();
  let html = `<div id="leetcode-clock">🕒 ${now}</div><hr style="border: 0.5px solid #00ffcc">`;

  // Sort leaderboard by solvedToday descending
  const sorted = [...userCounts].sort((a, b) => b.solvedToday - a.solvedToday);

  for (const { username, solvedToday } of sorted) {
    if (username === "noob_ace") {
      const goal = solvedToday * multiplier;
      html += `<b>👑 ${username}</b>: ${solvedToday} <br>🎯 Your goal: ${goal}<br><br>`;
    } else {
      html += `✅ ${username}: ${solvedToday}<br>`;
    }
  }

  widget.innerHTML = html;
}

// Update time every 30 seconds
function startClock() {
  setInterval(() => {
    if (widget.classList.contains("minimized")) return;
    const clock = document.getElementById("leetcode-clock");
    if (clock) {
      clock.textContent = `🕒 ${new Date().toLocaleTimeString()}`;
    }
  }, 1000 * 30);
}

// Refresh leaderboard
async function refreshData() {
  const results = await Promise.all(usernames.map(fetchTodaySolvedCount));
  renderWidget(results);
  startClock();
}

// START
refreshData();

