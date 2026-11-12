/* TRAFFIC BOT PRO - ADVANCED FREE SMART MANAGER */

(function () {
  "use strict";

  function createAIManager() {
    const admin = document.getElementById("adminSection");

    if (!admin || document.getElementById("aiManagerCard")) return;

    const card = document.createElement("div");
    card.className = "card";
    card.id = "aiManagerCard";

    card.innerHTML = `
      <h2>🤖 Advanced Free Smart Traffic Manager</h2>

      <p class="small">
        100% Free Traffic Analysis - No API, No Token, No Payment.
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
        Advanced Smart Manager Ready.
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

  function safePercent(current, previous) {
    if (previous === 0) {
      return current > 0 ? "New activity (previous period was 0)" : "0%";
    }

    const percent = ((current - previous) / previous) * 100;

    return (percent > 0 ? "+" : "") +
      percent.toFixed(1) + "%";
  }

  function analyzeTraffic() {
    const status = document.getElementById("freeAIStatus");
    const result = document.getElementById("freeAIResult");

    status.textContent = "Analyzing all available traffic reports...";

    try {
      const users = getNumber("reportTotalUsers");
      const websites = getNumber("reportTotalWebsites");
      const approved = getNumber("reportApprovedWebsites");
      const pending = getNumber("reportPendingWebsites");
      const rejected = getNumber("reportRejectedWebsites");
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

      const countryRows = getTableRows("countryReport");
      const websiteRows = getTableRows("websiteTrafficReport");
      const historyRows = getTableRows("visitHistory");

      let report = "";

      /* 1. PLATFORM OVERVIEW */

      report += "TRAFFIC BOT PRO - ADVANCED SMART REPORT\n";
      report += "========================================\n\n";

      report += "1. PLATFORM OVERVIEW\n";
      report += "Total Users: " + users + "\n";
      report += "Total Websites: " + websites + "\n";
      report += "Approved Websites: " + approved + "\n";
      report += "Pending Websites: " + pending + "\n";
      report += "Rejected Websites: " + rejected + "\n";
      report += "Recorded Visits: " + visits + "\n\n";

      /* 2. DAILY AND MONTHLY */

      report += "2. DAILY AND MONTHLY TRAFFIC\n";
      report += "Today: " + today + "\n";
      report += "Yesterday: " + yesterday + "\n";
      report += "Last 7 Days: " + week + "\n";
      report += "This Month: " + month + "\n";
      report += "Last Month: " + lastMonth + "\n\n";

      /* 3. GROWTH */

      const growth = safePercent(month, lastMonth);

      document.getElementById("freeAIGrowth").textContent =
        "Monthly Traffic Change: " + growth +
        "\nToday vs Yesterday: " +
        safePercent(today, yesterday);

      report += "3. TRAFFIC GROWTH\n";
      report += "Monthly Growth: " + growth + "\n";
      report += "Daily Change: " +
        safePercent(today, yesterday) + "\n\n";

      /* 4. COUNTRY RANKING */

      let countries = countryRows
        .filter(row => !/country/i.test(row[0]))
        .map(row => ({
          name: row[0],
          visits: Number(row[1].replace(/,/g, "")) || 0
        }))
        .sort((a, b) => b.visits - a.visits);

      let countryText = "";

      if (countries.length) {
        countries.forEach((country, index) => {
          countryText +=
            (index + 1) + ". " + country.name +
            " - " + country.visits + " visits\n";
        });
      } else {
        countryText = "Country data is not available.";
      }

      document.getElementById("freeAICountries").textContent =
        countryText;

      report += "4. COUNTRY RANKING\n" +
        countryText + "\n";

      /* 5. WEBSITE RANKING */

      let sites = websiteRows
        .filter(row => !/website/i.test(row[0]))
        .map(row => ({
          name: row[0],
          owner: row[1] || "Unknown",
          visits: Number((row[2] || "0").replace(/,/g, "")) || 0,
          today: Number((row[3] || "0").replace(/,/g, "")) || 0,
          week: Number((row[4] || "0").replace(/,/g, "")) || 0
        }))
        .sort((a, b) => b.visits - a.visits);

      let websiteText = "";

      if (sites.length) {
        sites.forEach((site, index) => {
          websiteText +=
            (index + 1) + ". " + site.name +
            " | Owner: " + site.owner +
            " | Total: " + site.visits +
            " | Today: " + site.today +
            " | 7 Days: " + site.week + "\n";
        });
      } else {
        websiteText = "Website ranking data is not available.";
      }

      document.getElementById("freeAIWebRanking").textContent =
        websiteText;

      report += "5. WEBSITE RANKING\n" +
        websiteText + "\n";

      /* 6. TOP WEBSITE */

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

      /* 7. SUSPICIOUS ACTIVITY */

      const visitorCounts = {};

      historyRows
        .filter(row => !/visitor/i.test(row[0]))
        .forEach(row => {
          const visitorId = row[2];

          if (visitorId) {
            visitorCounts[visitorId] =
              (visitorCounts[visitorId] || 0) + 1;
          }
        });

      const repeatedVisitors = Object.entries(visitorCounts)
        .filter(item => item[1] >= 3);

      let alerts = "";

      if (repeatedVisitors.length) {
        alerts +=
          "Repeated visitor IDs found in recent history:\n";

        repeatedVisitors.forEach(item => {
          alerts +=
            "Visitor ID " + item[0] +
            " appears " + item[1] +
            " times in the displayed history. Review manually.\n";
        });
      } else {
        alerts =
          "No repeated visitor ID appearing 3 or more times was found in the displayed history.";
      }

      alerts +=
        "\nNote: Repeated visits do not prove bot activity or fraud.";

      document.getElementById("freeAIAlerts").textContent =
        alerts;

      report += "7. ACTIVITY REVIEW\n" + alerts + "\n\n";

      /* 8. WEBSITE MANAGEMENT */

      report += "8. WEBSITE MANAGEMENT\n";

      if (pending > 0) {
        report += pending +
          " website(s) are waiting for approval.\n";
      } else {
        report += "No pending website approvals.\n";
      }

      report += "Rejected Websites: " + rejected + "\n\n";

      /* 9. RECOMMENDATIONS */

      let recommendations = [];

      if (users < 10) {
        recommendations.push(
          "Invite more genuine members to join your platform."
        );
      }

      if (websites === 0) {
        recommendations.push(
          "Encourage members to add their websites."
        );
      }

      if (week === 0) {
        recommendations.push(
          "Promote your platform to attract genuine visitors."
        );
      }

      if (pending > 0) {
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

      /* 10. FINAL REPORT */

      report += "========================================\n";
      report += "Generated locally using JavaScript.\n";
      report += "No paid AI API or token used.\n";

      result.textContent = report;

      status.textContent =
        "Advanced traffic analysis completed successfully.";

    } catch (error) {
      status.textContent =
        "Analysis error: " + error.message;

      result.textContent =
        "Could not complete the analysis. Please refresh Admin Reports and try again.";

      console.error("Free Smart Manager:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      createAIManager
    );
  } else {
    createAIManager();
  }

})();
