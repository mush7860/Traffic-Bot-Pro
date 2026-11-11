/* TRAFFIC BOT PRO - AI MANAGER */

(function () {
  "use strict";

  function createAIManager() {
    const admin = document.getElementById("adminSection");

    if (!admin || document.getElementById("aiManagerCard")) return;

    const card = document.createElement("div");
    card.className = "card";
    card.id = "aiManagerCard";

    card.innerHTML = `
      <h2>🤖 Traffic Bot Pro - AI Manager</h2>

      <p class="small">
        Admin-only AI traffic analysis and recommendations.
      </p>

      <div class="report-grid">
        <div class="report-stat">
          <span>Today's Visitors</span>
          <strong id="aiToday">—</strong>
        </div>

        <div class="report-stat">
          <span>Last 7 Days</span>
          <strong id="aiWeek">—</strong>
        </div>

        <div class="report-stat">
          <span>This Month</span>
          <strong id="aiMonth">—</strong>
        </div>
      </div>

      <label><strong>Ask AI Manager</strong></label>

      <textarea
        id="aiQuestion"
        rows="4"
        maxlength="6000"
        placeholder="Example: Analyze my website traffic and suggest improvements."
        style="width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:8px;margin:10px 0;"
      ></textarea>

      <button class="primary" id="aiAnalyzeButton">
        🤖 Analyze Traffic
      </button>

      <button class="primary success" id="aiQuickReport">
        📊 Generate Traffic Report
      </button>

      <div id="aiStatus" class="message" style="margin-top:15px;">
        AI Manager ready. Enter your question.
      </div>

      <div class="chart-card">
        <h3>AI Analysis Result</h3>
        <div id="aiAnswer" style="white-space:pre-wrap;overflow-wrap:anywhere;">
          Your AI report will appear here.
        </div>
      </div>
    `;

    admin.appendChild(card);

    document.getElementById("aiAnalyzeButton")
      .addEventListener("click", function () {
        runAIAnalysis(false);
      });

    document.getElementById("aiQuickReport")
      .addEventListener("click", function () {
        document.getElementById("aiQuestion").value =
          "Analyze my current website traffic reports. Explain daily, monthly, country-wise and website-wise performance. Identify suspicious patterns and give practical improvement suggestions.";

        runAIAnalysis(true);
      });
  }

  function getTrafficContext() {
    const ids = [
      "reportTotalUsers",
      "reportTotalWebsites",
      "reportApprovedWebsites",
      "reportPendingWebsites",
      "reportRejectedWebsites",
      "reportTotalVisits",
      "todayVisitors",
      "yesterdayVisitors",
      "last7DaysVisitors",
      "thisMonthVisitors",
      "lastMonthVisitors",
      "countryReport",
      "websiteTrafficReport",
      "visitHistory",
      "historicalTrafficChart"
    ];

    const context = {};

    ids.forEach(function (id) {
      const element = document.getElementById(id);

      if (element) {
        context[id] = element.innerText.slice(0, 2500);
      }
    });

    return context;
  }

  async function runAIAnalysis(quickReport) {
    const question = document.getElementById("aiQuestion").value.trim();
    const status = document.getElementById("aiStatus");
    const answer = document.getElementById("aiAnswer");
    const button = document.getElementById("aiAnalyzeButton");

    if (!question) {
      status.textContent = "Please enter your question.";
      return;
    }

    if (
      typeof currentUser === "undefined" ||
      !currentUser
    ) {
      status.textContent = "Please login first.";
      return;
    }

    if (
      typeof currentProfile === "undefined" ||
      !currentProfile ||
      currentProfile.is_admin !== true
    ) {
      status.textContent = "Admin access required.";
      return;
    }

    button.disabled = true;
    status.textContent = "AI is analyzing your reports...";
    answer.textContent = "Please wait...";

    try {
      const { data, error } = await db.functions.invoke(
        "traffic-ai-manager-v2",
        {
          body: {
            message: question,
            context: getTrafficContext()
          }
        }
      );

      if (error) {
        let details = error.message || "AI request failed.";

        try {
          if (error.context) {
            const response = await error.context.json();
            details = response.error || details;

            if (response.details) {
              details += "\n" + response.details;
            }
          }
        } catch (_) {}

        throw new Error(details);
      }

      if (!data || data.success !== true || !data.answer) {
        throw new Error(data?.error || "No AI response received.");
      }

      answer.textContent = data.answer;
      status.textContent = "AI analysis completed successfully.";

    } catch (error) {
      answer.textContent = "AI analysis could not be completed.";
      status.textContent = "Error: " + error.message;
    } finally {
      button.disabled = false;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createAIManager);
  } else {
    createAIManager();
  }

})();
