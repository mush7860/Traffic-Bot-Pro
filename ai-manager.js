/* TRAFFIC BOT PRO - FREE SMART TRAFFIC ANALYSIS */

(function () {
  "use strict";

  function createAIManager() {
    const admin = document.getElementById("adminSection");

    if (!admin || document.getElementById("aiManagerCard")) return;

    const card = document.createElement("div");
    card.className = "card";
    card.id = "aiManagerCard";

    card.innerHTML = `
      <h2>🤖 Free Smart Traffic Manager</h2>

      <p class="small">
        Automatic traffic analysis. No API, no token, no payment.
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

      <h3>📊 Automatic Traffic Analysis</h3>

      <button class="primary" id="freeAIAnalyze">
        Analyze My Traffic
      </button>

      <button class="primary success" id="freeAIRefresh">
        Refresh Analysis
      </button>

      <div id="freeAIStatus" class="message" style="margin-top:15px;">
        Free Traffic Manager Ready.
      </div>

      <div class="chart-card">
        <h3>📈 Traffic Performance</h3>
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
  }

  function getNumber(id) {
    const element = document.getElementById(id);

    if (!element) return 0;

    const match = element.innerText.match(/[\d,]+/);

    return match ? Number(match[0].replace(/,/g, "")) : 0;
  }

  function analyzeTraffic() {
    const status = document.getElementById("freeAIStatus");
    const result = document.getElementById("freeAIResult");

    status.textContent = "Analyzing your traffic reports...";

    const users = getNumber("reportTotalUsers");
    const websites = getNumber("reportTotalWebsites");
    const approved = getNumber("reportApprovedWebsites");
    const pending = getNumber("reportPendingWebsites");
    const visits = getNumber("reportTotalVisits");

    const today = getNumber("todayVisitors");
    const yesterday = getNumber("yesterdayVisitors");
    const week = getNumber("last7DaysVisitors");
    const month = getNumber("thisMonthVisitors");
    const lastMonth = getNumber("lastMonthVisitors");

    document.getElementById("freeAIUsers").textContent = users;
    document.getElementById("freeAIWebsites").textContent = websites;
    document.getElementById("freeAIVisits").textContent = visits;
    document.getElementById("freeAIWeek").textContent = week;

    let report = "";

    report += "TRAFFIC BOT PRO - SMART REPORT\n";
    report += "================================\n\n";

    report += "1. PLATFORM OVERVIEW\n";
    report += "Total Users: " + users + "\n";
    report += "Total Websites: " + websites + "\n";
    report += "Approved Websites: " + approved + "\n";
    report += "Pending Websites: " + pending + "\n";
    report += "Recorded Visits: " + visits + "\n\n";

    report += "2. DAILY TRAFFIC\n";
    report += "Today's Visitors: " + today + "\n";
    report += "Yesterday's Visitors: " + yesterday + "\n";
    report += "Last 7 Days: " + week + "\n\n";

    report += "3. MONTHLY TRAFFIC\n";
    report += "This Month: " + month + "\n";
    report += "Last Month: " + lastMonth + "\n\n";

    report += "4. AUTOMATIC ANALYSIS\n";

    if (visits === 0) {
      report += "No recorded visits found yet. Start recording website visits.\n";
    } else {
      report += "Your platform has recorded " + visits + " visits.\n";
    }

    if (today > yesterday) {
      report += "Daily traffic is higher than yesterday.\n";
    } else if (today < yesterday) {
      report += "Daily traffic is lower than yesterday.\n";
    } else {
      report += "Today's traffic is equal to yesterday's traffic.\n";
    }

    if (week > 0) {
      report += "Your platform received visitors during the last 7 days.\n";
    } else {
      report += "No visits recorded in the last 7 days.\n";
    }

    if (month > lastMonth) {
      report += "Monthly traffic is higher than last month.\n";
    } else if (month < lastMonth) {
      report += "Monthly traffic is lower than last month.\n";
    } else {
      report += "Monthly traffic is equal to last month.\n";
    }

    report += "\n5. WEBSITE MANAGEMENT\n";

    if (pending > 0) {
      report += pending + " website(s) are waiting for approval.\n";
    } else {
      report += "No pending website approvals.\n";
    }

    if (websites > approved) {
      report += "Some websites are not approved yet. Check website status.\n";
    } else {
      report += "All registered websites are approved.\n";
    }

    report += "\n6. SMART RECOMMENDATIONS\n";
    report += "1. Invite more genuine website owners to join.\n";
    report += "2. Encourage members to share their approved websites.\n";
    report += "3. Monitor daily and weekly traffic regularly.\n";
    report += "4. Check country-wise and website-wise reports.\n";
    report += "5. Investigate unusual visitor patterns manually.\n";
    report += "6. Keep website approval and membership records updated.\n";

    report += "\n================================\n";
    report += "Report generated locally. No paid AI API used.";

    result.textContent = report;
    status.textContent = "Traffic analysis completed successfully.";

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createAIManager);
  } else {
    createAIManager();
  }

})();
