/* =========================================
   TRAFFIC BOT PRO - SMART GROWTH MANAGER
   Free SEO & Social Promotion Assistant
========================================= */

(function () {
"use strict";

function startGrowthManager() {

if (document.getElementById("growthManager")) return;

const style = document.createElement("style");

style.textContent = `
#growthManager {
  background:#101827;
  color:white;
  padding:20px;
  margin:20px 0;
  border-radius:14px;
  font-family:Arial,sans-serif;
}
#growthManager h2 {
  color:#38bdf8;
}
#growthManager input,
#growthManager textarea,
#growthManager select {
  width:100%;
  box-sizing:border-box;
  padding:12px;
  margin:8px 0 14px;
  border-radius:7px;
  border:1px solid #475569;
  background:#1e293b;
  color:white;
}
#growthManager button {
  padding:11px 15px;
  margin:5px 3px;
  border:0;
  border-radius:7px;
  background:#0284c7;
  color:white;
  cursor:pointer;
}
#growthManager button:hover {
  background:#0369a1;
}
#growthManager .gm-card {
  background:#1e293b;
  padding:15px;
  margin:15px 0;
  border-radius:10px;
}
#growthManager .gm-output {
  background:#0f172a;
  padding:12px;
  border-radius:7px;
  white-space:pre-wrap;
  overflow-wrap:anywhere;
  min-height:45px;
}
#growthManager .gm-note {
  color:#cbd5e1;
  font-size:13px;
}
`;

document.head.appendChild(style);

const panel = document.createElement("section");

panel.id = "growthManager";

panel.innerHTML = `

<h2>🤖 Smart Growth Manager</h2>

<p>
SEO & Social Media Promotion Assistant
</p>

<p class="gm-note">
Free content generator. No API or paid token required.
</p>

<div class="gm-card">

<h3>🌐 Website Information</h3>

<label>Website Name</label>

<input id="gmName"
placeholder="Enter website name">

<label>Website URL</label>

<input id="gmUrl"
placeholder="https://example.com">

<label>Website Topic / Service</label>

<textarea id="gmTopic"
placeholder="Describe your website and its services"></textarea>

<button id="gmSeo">
Generate SEO Content
</button>

</div>

<div class="gm-card">

<h3>🔍 SEO Title</h3>

<div id="gmTitle" class="gm-output">
Your SEO title will appear here.
</div>

<button id="gmCopyTitle">Copy Title</button>

<h3>📝 Meta Description</h3>

<div id="gmDescription" class="gm-output">
Your description will appear here.
</div>

<button id="gmCopyDescription">
Copy Description
</button>

<h3>🔑 Suggested Keywords</h3>

<div id="gmKeywords" class="gm-output">
Keywords will appear here.
</div>

<button id="gmCopyKeywords">
Copy Keywords
</button>

</div>

<div class="gm-card">

<h3>📢 Social Media Promotion</h3>

<label>Select Platform</label>

<select id="gmPlatform">

<option value="Facebook">Facebook</option>

<option value="Instagram">Instagram</option>

<option value="WhatsApp">WhatsApp</option>

<option value="X">X / Twitter</option>

</select>

<button id="gmSocial">
Generate Promotion Post
</button>

<div id="gmSocialOutput" class="gm-output">
Your promotional post will appear here.
</div>

<button id="gmCopySocial">
Copy Promotion
</button>

</div>

<div class="gm-card">

<h3>📈 Growth Suggestions</h3>

<div id="gmSuggestions" class="gm-output">
Enter your website information to receive suggestions.
</div>

<button id="gmSuggest">
Generate Suggestions
</button>

</div>

<p class="gm-note">
Note: This tool generates content suggestions.
It does not guarantee Google ranking, visitors or earnings.
</p>

`;

document.body.appendChild(panel);


/* SAFE TEXT */

function getValue(id) {

return document.getElementById(id).value.trim();

}


/* COPY FUNCTION */

async function copyText(id) {

const text =
document.getElementById(id).textContent.trim();

if (!text) return;

try {

await navigator.clipboard.writeText(text);

alert("Copied successfully!");

} catch (error) {

const area = document.createElement("textarea");

area.value = text;

document.body.appendChild(area);

area.select();

document.execCommand("copy");

area.remove();

alert("Copied successfully!");

}

}


/* SEO GENERATOR */

document.getElementById("gmSeo")
.addEventListener("click", function () {

const name = getValue("gmName");

const url = getValue("gmUrl");

const topic = getValue("gmTopic");

if (!name || !url || !topic) {

alert("Please enter website name, URL and topic.");

return;

}

const title =
name + " - " + topic + " | Official Website";

const description =
"Discover " + name + ". " +
topic + ". Visit " + url +
" to explore more information and useful services.";

const keywords = [

name,

topic,

name + " online",

topic + " website",

"official website",

"online services",

"website information"

];

document.getElementById("gmTitle")
.textContent = title;

document.getElementById("gmDescription")
.textContent = description;

document.getElementById("gmKeywords")
.textContent = keywords.join(", ");

document.getElementById("gmSuggestions")
.textContent =
"1. Publish useful original content.\n\n" +
"2. Make your website mobile friendly.\n\n" +
"3. Use descriptive page titles.\n\n" +
"4. Share useful content on social media.\n\n" +
"5. Improve website loading speed.\n\n" +
"6. Track genuine visitors using analytics.";

});


/* SOCIAL PROMOTION GENERATOR */

document.getElementById("gmSocial")
.addEventListener("click", function () {

const name = getValue("gmName");

const url = getValue("gmUrl");

const topic = getValue("gmTopic");

const platform = getValue("gmPlatform");

if (!name || !url || !topic) {

alert("Enter website information first.");

return;

}

let message = "";

if (platform === "Facebook") {

message =
"🌐 Discover " + name + "!\n\n" +
topic + "\n\n" +
"Visit our website:\n" + url +
"\n\n#Website #OnlineServices #Discover";

}

else if (platform === "Instagram") {

message =
"✨ Explore " + name + "!\n\n" +
topic + "\n\n" +
"Visit: " + url +
"\n\n#Website #Digital #Explore #Online";

}

else if (platform === "WhatsApp") {

message =
"Hello!\n\n" +
"Check out " + name + ".\n\n" +
topic + "\n\n" +
"Website: " + url;

}

else {

message =
"Discover " + name + "!\n\n" +
topic + "\n\n" +
url +
"\n\n#Website #Digital";

}

document.getElementById("gmSocialOutput")
.textContent = message;

});


/* GROWTH SUGGESTIONS */

document.getElementById("gmSuggest")
.addEventListener("click", function () {

const topic = getValue("gmTopic");

if (!topic) {

alert("Please enter your website topic.");

return;

}

const suggestions = [

"Create original articles related to " + topic + ".",

"Answer common questions people search about this topic.",

"Share useful information in relevant communities.",

"Create short videos explaining your website services.",

"Add clear navigation and contact information.",

"Monitor real visitors and improve pages with low engagement.",

"Use Google Search Console to monitor search performance."

];

document.getElementById("gmSuggestions")
.textContent = suggestions
.map((item, index) =>
(index + 1) + ". " + item
).join("\n\n");

});


/* COPY BUTTONS */

document.getElementById("gmCopyTitle")
.onclick = () => copyText("gmTitle");

document.getElementById("gmCopyDescription")
.onclick = () => copyText("gmDescription");

document.getElementById("gmCopyKeywords")
.onclick = () => copyText("gmKeywords");

document.getElementById("gmCopySocial")
.onclick = () => copyText("gmSocialOutput");


console.log("Traffic Bot Pro Growth Manager Loaded");

}


/* START AFTER PAGE LOAD */

if (document.readyState === "loading") {

document.addEventListener("DOMContentLoaded", startGrowthManager);

} else {

startGrowthManager();

}

})();
