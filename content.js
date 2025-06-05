const usernames = [
  "noob_ace",
  "anonymusic",
  "zendovo",
  "sansi03",
  "yeah_right"
];

const multiplier = 4;

// STEP 1: Inject widget container
const widget = document.createElement("div");
widget.id = "leetcode-widget";
document.body.appendChild(widget);

// STEP 2: Fetch and display data
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

async function refreshData() {
  const results = await Promise.all(usernames.map(fetchTodaySolvedCount));
  renderWidget(results);
  startClock(); // start only after render
}

// STEP 3: Render widget
function renderWidget(userCounts) {
  const now = new Date().toLocaleTimeString();
  let html = `<div id="leetcode-clock">🕒 ${now}</div><br>`;

  for (const { username, solvedToday } of userCounts) {
    if (username === "noob_ace") {
      const goal = solvedToday * multiplier;
      html += `✅ ${username}: ${solvedToday}<br>🎯 Your goal: ${goal}<br><br>`;
    } else {
      html += `✅ ${username}: ${solvedToday}<br>`;
    }
  }

  widget.innerHTML = html;
}

// STEP 4: Update time every 30 seconds
function startClock() {
  setInterval(() => {
    const clock = document.getElementById("leetcode-clock");
    if (clock) {
      clock.textContent = `🕒 ${new Date().toLocaleTimeString()}`;
    }
  }, 1000 * 30);
}

// START
refreshData();

