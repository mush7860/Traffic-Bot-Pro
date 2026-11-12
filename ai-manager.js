/* TRAFFIC BOT PRO - ADVANCED FREE SMART MANAGER + CHAT */

(function () {
  "use strict";

  let latestData = null;

  function createAIManager() {
    const admin = document.getElementById("adminSection");

    if (!admin || document.getElementById("aiManagerCard")) return;

    const card = document.createElement("div");
    card.className = "card";
    card.id = "aiManagerCard";

    card.innerHTML = `
      <h2>🤖 Advanced Free Smart Traffic Manager</h2>

      <p class="small">
        Free Smart Analysis & Chat - No API, No Token, No Payment.
      </p>

      <div class="report-grid">
        <div class="report-stat">
          <span>Total Users</span>
          <strong id="freeAIUsers">0</strong>
        </div>
        <div class="report-stat">
          <span>Total Websites</span>
          <strong id="freeAIWebsites">0</strong>
        </div>
        <div class="report-stat">
          <span>Total Visits</span>
          <strong id="freeAIVisits">0</strong>
        </div>
        <div class="report-stat">
          <span>Last 7 Days</span>
          <strong id="freeAIWeek">0</strong>
        </div>
      </div>

      <h3>📊 Advanced Traffic Analysis</h3>

      <button class="primary" id="freeAIAnalyze">
        🤖 Analyze My Traffic
      </button>

      <button class="primary success" id="freeAIRefresh">
        🔄 Refresh Analysis
      </button>

      <div id="freeAIStatus" class="message" style="margin-top:15px;">
        Smart Manager Ready.
      </div>

      <div class="chart-card">
        <h3>🌍 Country Ranking</h3>
        <div id="freeAICountries"></div>
      </div>

      <div class="chart-card">
        <h3>🌐 Website Ranking</h3>
        <div id="freeAIWebRanking"></div>
      </div>

      <div class="chart-card">
        <h3>📈 Traffic Growth</h3>
        <div id="freeAIGrowth"></div>
      </div>

      <div class="chart-card">
        <h3>🚨 Suspicious Activity Alerts</h3>
        <div id="freeAIAlerts"></div>
      </div>

      <div class="chart-card">
        <h3>🏆 Top Performing Website</h3>
        <div id="freeAITopWebsite"></div>
      </div>

      <div class="chart-card">
        <h3>💡 Smart Recommendations</h3>
        <div id="freeAIRecommendations"></div>
      </div>

      <div class="chart-card">
        <h3>💬 Traffic Assistant Chat</h3>

        <p class="small">
          Ask questions about your platform traffic and reports.
        </p>

        <div id="freeAIChatMessages"
          style="min-height:100px;max-height:300px;overflow-y:auto;
          padding:10px;border:1px solid #ccc;border-radius:8px;
          margin-bottom:12px;">
          <p><strong>Assistant:</strong> Hello! Analyze your traffic and ask me questions.</p>
        </div>

        <textarea id="freeAIChatInput"
          placeholder="Ask something... Example: Which website has highest traffic?"
          rows="3"
          style="width:100%;box-sizing:border-box;padding:12px;
          border-radius:8px;margin-bottom:10px;"></textarea>

        <button class="primary" id="freeAIChatSend">
          ➤ Send Message
        </button>

        <button class="primary success" id="freeAIChatClear">
          Clear Chat
        </button>
      </div>

      <div class="chart-card">
        <h3>📋 Complete Traffic Report</h3>

        <div id="freeAIResult"
          style="white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.8;">
          Click Analyze My Traffic to generate your report.
        </div>
      </div>
    `;

    admin.appendChild(card);

    document.getElementById("freeAIAnalyze")
      .addEventListener("click", analyzeTraffic);

    document.getElementById("freeAIRefresh")
      .addEventListener("click", analyzeTraffic);

    document.getElementById("freeAIChatSend")
      .addEventListener("click", sendChatMessage);

    document.getElementById("freeAIChatClear")
      .addEventListener("click", clearChat);

    document.getElementById("freeAIChatInput")
      .addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          sendChatMessage();
        }
      });
  }

  function getElementText(id) {
    const element = document.getElementById(id);
    return element ? element.innerText.trim() : "";
  }

  function getNumber(id) {
    const text = getElementText(id);
    const match = text.match(/[\d,]+/);

    return match
      ? Number(match[0].replace(/,/g, ""))
      : 0;
  }

  function getTableRows(id) {
    const element = document.getElementById(id);

    if (!element) return [];

    return Array.from(element.querySelectorAll("tr"))
      .map(row =>
        Array.from(row.querySelectorAll("th, td"))
          .map(cell => cell.innerText.trim())
      )
      .filter(row => row.length >= 2);
  }

  /* READ WEBSITE DATA FROM INDEX.HTML */

  function getWebsiteRows() {
    const rows = window.trafficBotWebsiteRows;

    if (!Array.isArray(rows)) {
      return [];
    }

    return rows.map(row => [
      row.name || "Unknown Website",
      row.owner || "Unknown",
      String(Number(row.total || 0)),
      String(Number(row.today || 0)),
      String(Number(row.last7 || 0))
    ]);
  }

  function safePercent(current, previous) {
    if (previous === 0) {
      return current > 0
        ? "New activity (previous period was 0)"
        : "0%";
    }

    const percent = ((current - previous) / previous) * 100;

    return (percent > 0 ? "+" : "") +
      percent.toFixed(1) + "%";
  }

  function addChatMessage(sender, message) {
    const box = document.getElementById("freeAIChatMessages");

    if (!box) return;

    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = sender + ": ";

    paragraph.appendChild(strong);
    paragraph.appendChild(document.createTextNode(message));

    box.appendChild(paragraph);
    box.scrollTop = box.scrollHeight;
  }

  /* MAIN TRAFFIC ANALYSIS */

  function analyzeTraffic() {
    const status = document.getElementById("freeAIStatus");
    const result = document.getElementById("freeAIResult");

    if (!status || !result) return;

    status.textContent = "Analyzing traffic reports...";

    try {
      const data = {
        users: getNumber("reportTotalUsers"),
        websites: getNumber("reportTotalWebsites"),
        approved: getNumber("reportApprovedWebsites"),
        pending: getNumber("reportPendingWebsites"),
        rejected: getNumber("reportRejectedWebsites"),
        visits: getNumber("reportTotalVisits"),

        today: getNumber("todayVisitors"),
        yesterday: getNumber("yesterdayVisitors"),
        week: getNumber("last7DaysVisitors"),
        month: getNumber("thisMonthVisitors"),
        lastMonth: getNumber("lastMonthVisitors")
      };

      document.getElementById("freeAIUsers").textContent = data.users;
      document.getElementById("freeAIWebsites").textContent = data.websites;
      document.getElementById("freeAIVisits").textContent = data.visits;
      document.getElementById("freeAIWeek").textContent = data.week;

      const countryRows = getTableRows("countryReport");
      const websiteRows = getWebsiteRows();
      const historyRows = getTableRows("visitHistory");

      /* COUNTRY ANALYSIS */

      const countries = countryRows
        .filter(row => !/country/i.test(row[0]))
        .map(row => ({
          name: row[0],
          visits: Number((row[1] || "0").replace(/,/g, "")) || 0
        }))
        .filter(item => item.name)
        .sort((a, b) => b.visits - a.visits);

      /* WEBSITE ANALYSIS */

      const sites = websiteRows
        .filter(row => !/website/i.test(row[0]))
        .map(row => ({
          name: row[0],
          owner: row[1] || "Unknown",
          visits: Number((row[2] || "0").replace(/,/g, "")) || 0,
          today: Number((row[3] || "0").replace(/,/g, "")) || 0,
          week: Number((row[4] || "0").replace(/,/g, "")) || 0
        }))
        .filter(site => site.name)
        .sort((a, b) => b.visits - a.visits);

      latestData = {
        ...data,
        countries,
        sites
      };

      let report = "";

      report += "TRAFFIC BOT PRO - ADVANCED SMART REPORT\n";
      report += "========================================\n\n";

      report += "1. PLATFORM OVERVIEW\n";
      report += "Total Users: " + data.users + "\n";
      report += "Total Websites: " + data.websites + "\n";
      report += "Approved Websites: " + data.approved + "\n";
      report += "Pending Websites: " + data.pending + "\n";
      report += "Rejected Websites: " + data.rejected + "\n";
      report += "Recorded Visits: " + data.visits + "\n\n";

      report += "2. DAILY AND MONTHLY TRAFFIC\n";
      report += "Today: " + data.today + "\n";
      report += "Yesterday: " + data.yesterday + "\n";
      report += "Last 7 Days: " + data.week + "\n";
      report += "This Month: " + data.month + "\n";
      report += "Last Month: " + data.lastMonth + "\n\n";

      /* TRAFFIC GROWTH */

      const growth = safePercent(data.month, data.lastMonth);
      const dailyGrowth = safePercent(data.today, data.yesterday);

      document.getElementById("freeAIGrowth").textContent =
        "Monthly Traffic Change: " + growth +
        "\nToday vs Yesterday: " + dailyGrowth;

      report += "3. TRAFFIC GROWTH\n";
      report += "Monthly Growth: " + growth + "\n";
      report += "Daily Change: " + dailyGrowth + "\n\n";

      /* COUNTRY RANKING */

      const countryText = countries.length
        ? countries.map((country, index) =>
            (index + 1) + ". " + country.name +
            " - " + country.visits + " visits"
          ).join("\n")
        : "Country data is not available.";

      document.getElementById("freeAICountries").textContent =
        countryText;

      report += "4. COUNTRY RANKING\n" + countryText + "\n\n";

      /* WEBSITE RANKING */

      const websiteText = sites.length
        ? sites.map((site, index) =>
            (index + 1) + ". " + site.name +
            " | Owner: " + site.owner +
            " | Total: " + site.visits +
            " | Today: " + site.today +
            " | 7 Days: " + site.week
          ).join("\n")
        : "Website ranking data is not available.";

      document.getElementById("freeAIWebRanking").textContent =
        websiteText;

      report += "5. WEBSITE RANKING\n" + websiteText + "\n\n";

      /* TOP WEBSITE */

      const top = sites.length ? sites[0] : null;

      document.getElementById("freeAITopWebsite").textContent =
        top
          ? top.name + "\nTotal Visits: " + top.visits +
            "\nOwner: " + top.owner
          : "No website ranking available.";

      report += "6. TOP PERFORMING WEBSITE\n";

      report += top
        ? top.name + " with " + top.visits + " visits.\n\n"
        : "No ranking data available.\n\n";

      /* ACTIVITY REVIEW */

      const visitorCounts = {};

      historyRows.forEach(row => {
        const visitorId = row[2];

        if (visitorId) {
          visitorCounts[visitorId] =
            (visitorCounts[visitorId] || 0) + 1;
        }
      });

      const repeatedVisitors = Object.entries(visitorCounts)
        .filter(item => item[1] >= 3);

      let alerts = repeatedVisitors.length
        ? repeatedVisitors.map(item =>
            "Visitor ID " + item[0] +
            " appears " + item[1] +
            " times. Review manually."
          ).join("\n")
        : "No repeated visitor ID appearing 3 or more times was found in the displayed history.";

      alerts +=
        "\nNote: Repeated visits do not prove bot activity or fraud.";

      document.getElementById("freeAIAlerts").textContent = alerts;

      report += "7. ACTIVITY REVIEW\n" + alerts + "\n\n";

      /* WEBSITE MANAGEMENT */

      report += "8. WEBSITE MANAGEMENT\n";

      report += data.pending > 0
        ? data.pending + " website(s) are waiting for approval.\n"
        : "No pending website approvals.\n";

      report += "Rejected Websites: " + data.rejected + "\n\n";

      /* SMART RECOMMENDATIONS */

      const recommendations = [];

      if (data.users < 10) {
        recommendations.push(
          "Invite more genuine members to join your platform."
        );
      }

      if (data.websites === 0) {
        recommendations.push(
          "Encourage members to add their websites."
        );
      }

      if (data.week === 0) {
        recommendations.push(
          "Promote your platform to attract genuine visitors."
        );
      }

      if (data.pending > 0) {
        recommendations.push(
          "Review pending website approval requests."
        );
      }

      if (top) {
        recommendations.push(
          "Study the top performing website and learn what brings it visitors."
        );
      }

      recommendations.push(
        "Check country-wise and website-wise traffic regularly."
      );

      recommendations.push(
        "Review unusual visitor patterns before taking action."
      );

      recommendations.push(
        "Encourage genuine traffic and follow website policies."
      );

      const recommendationText = recommendations
        .map((item, index) => (index + 1) + ". " + item)
        .join("\n");

      document.getElementById("freeAIRecommendations").textContent =
        recommendationText;

      report += "9. SMART RECOMMENDATIONS\n";
      report += recommendationText + "\n\n";

      report += "========================================\n";
      report += "Generated locally using JavaScript.\n";
      report += "No paid AI API or token used.\n";

      result.textContent = report;

      status.textContent =
        "Advanced traffic analysis completed successfully.";

    } catch (error) {
      status.textContent = "Analysis error: " + error.message;

      result.textContent =
        "Could not complete the analysis. Please refresh Admin Reports and try again.";

      console.error("Free Smart Manager:", error);
    }
  }

  /* CHAT ASSISTANT */

  function getChatAnswer(question) {
    const q = question.toLowerCase().trim();

    if (!latestData) {
      return "Please click Analyze My Traffic first. Then I can answer questions using your latest traffic reports.";
    }

    const d = latestData;

    if (
      q.includes("country") ||
      q.includes("india") ||
      q.includes("which country")
    ) {
      if (!d.countries.length) {
        return "Country report data is currently unavailable.";
      }

      return "Country traffic ranking:\n" +
        d.countries.map((c, i) =>
          (i + 1) + ". " + c.name + " - " + c.visits + " visits"
        ).join("\n");
    }

    if (
      q.includes("top website") ||
      q.includes("highest traffic") ||
      q.includes("best website") ||
      q.includes("website ranking") ||
      q.includes("website")
    ) {
      if (!d.sites.length) {
        return "Website ranking data is not available. Please refresh the Website Traffic Report and Analyze My Traffic again.";
      }

      return "Website ranking:\n" +
        d.sites.map((s, i) =>
          (i + 1) + ". " + s.name +
          " - " + s.visits + " visits"
        ).join("\n") +
        "\n\nTop website: " + d.sites[0].name +
        " with " + d.sites[0].visits + " visits.";
    }

    if (q.includes("today")) {
      return "Today's recorded visitors: " + d.today +
        ". Yesterday's visitors: " + d.yesterday + ".";
    }

    if (q.includes("yesterday")) {
      return "Yesterday's recorded visitors: " + d.yesterday + ".";
    }

    if (
      q.includes("7 days") ||
      q.includes("last week") ||
      q.includes("weekly")
    ) {
      return "Recorded visits in the last 7 days: " + d.week + ".";
    }

    if (
      q.includes("month") ||
      q.includes("monthly")
    ) {
      return "This month: " + d.month +
        " recorded visits.\nLast month: " + d.lastMonth +
        ".\nMonthly change: " +
        safePercent(d.month, d.lastMonth) + ".";
    }

    if (
      q.includes("user") ||
      q.includes("member")
    ) {
      return "Your platform currently has " + d.users +
        " registered users.";
    }

    if (
      q.includes("total visit") ||
      q.includes("total traffic") ||
      q.includes("how many visit")
    ) {
      return "Your platform has " + d.visits +
        " total recorded visits.";
    }

    if (
      q.includes("pending") ||
      q.includes("approval")
    ) {
      return "Pending websites: " + d.pending +
        ". Approved websites: " + d.approved +
        ". Rejected websites: " + d.rejected + ".";
    }

    if (
      q.includes("grow") ||
      q.includes("increase") ||
      q.includes("improve") ||
      q.includes("recommend")
    ) {
      return "Traffic growth suggestions:\n" +
        "1. Invite genuine members.\n" +
        "2. Promote your platform on relevant social media.\n" +
        "3. Encourage members to submit useful websites.\n" +
        "4. Check country and website reports regularly.\n" +
        "5. Follow website policies and avoid artificial traffic.";
    }

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("namaste")
    ) {
      return "Hello! I am your Traffic Bot Pro Smart Assistant. Ask me about users, visits, countries, websites or traffic growth.";
    }

    if (
      q.includes("help") ||
      q.includes("what can")
    ) {
      return "You can ask me questions like:\n" +
        "• How many total visits?\n" +
        "• Which country has most visitors?\n" +
        "• Which website has highest traffic?\n" +
        "• How many visitors came today?\n" +
        "• How many users are registered?\n" +
        "• How can I increase traffic?";
    }

    return "I can answer questions about your available traffic reports. Try asking about total visits, users, countries, websites, today's traffic, monthly traffic or traffic growth.";
  }

  function sendChatMessage() {
    const input = document.getElementById("freeAIChatInput");

    if (!input) return;

    const question = input.value.trim();

    if (!question) {
      addChatMessage("Assistant", "Please type a question first.");
      return;
    }

    addChatMessage("You", question);

    input.value = "";

    const answer = getChatAnswer(question);

    addChatMessage("Assistant", answer);
  }

  function clearChat() {
    const box = document.getElementById("freeAIChatMessages");

    if (box) {
      box.innerHTML =
        "<p><strong>Assistant:</strong> Chat cleared. Ask me a new question.</p>";
    }
  }

  /* INITIALIZE SMART MANAGER */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createAIManager);
  } else {
    createAIManager();
  }

})();
