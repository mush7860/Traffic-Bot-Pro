const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Traffic Bot Pro</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#f1f5f9;color:#172033;font-family:Arial,sans-serif}
header{background:#172554;color:white;text-align:center;padding:22px}
header h1{margin:0}
nav{background:#fff;padding:12px;text-align:center;box-shadow:0 2px 8px #ddd}
button{background:#2563eb;color:white;border:0;border-radius:7px;padding:11px 16px;cursor:pointer;margin:4px}
button:hover{background:#1d4ed8}
input,select{width:100%;padding:12px;margin:7px 0;border:1px solid #cbd5e1;border-radius:7px}
main{max-width:950px;margin:20px auto;padding:12px}
.card{background:white;padding:18px;margin:12px 0;border-radius:12px;box-shadow:0 2px 9px #0001}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.stat{background:#eff6ff;padding:16px;border-radius:9px;text-align:center}
.stat b{display:block;font-size:25px;color:#1d4ed8}
.hidden{display:none}
.small{color:#64748b;font-size:13px}
.site{border-bottom:1px solid #ddd;padding:12px 0;overflow-wrap:anywhere}
a{color:#2563eb}
footer{text-align:center;padding:25px;color:#64748b}
</style>
</head>
<body>
<header>
<h1>TRAFFIC BOT PRO</h1>
<p>Worldwide Website Traffic Exchange Platform</p>
</header>
<nav>
<button onclick="show('home')">Home</button>
<button onclick="show('login')">Login</button>
<button onclick="show('register')">Register</button>
<button onclick="show('dashboard')">Dashboard</button>
<button onclick="logout()">Logout</button>
</nav>
<main>
<section id="home">
<div class="card">
<h2>Grow Your Website Audience</h2>
<p>Discover websites and exchange genuine voluntary visits with other members.</p>
<button onclick="show('register')">Get Started</button>
</div>
<div class="card"><h3>Banner Advertisement</h3><div id="banner">Advertisement space</div></div>
<div class="card"><h3>Video Advertisement</h3><div id="video">Video advertisement space</div></div>
<div class="card"><h3>Membership Plans</h3>
<div class="grid">
<div class="stat"><b>Free</b>₹0</div>
<div class="stat"><b>₹99</b>7 Days</div>
<div class="stat"><b>₹299</b>30 Days</div>
<div class="stat"><b>₹999</b>90 Days</div>
</div>
<p class="small">Premium prices are displayed for information. Online payment is not enabled yet.</p>
</div>
</section>

<section id="register" class="hidden">
<div class="card"><h2>Create Account</h2>
<input id="rname" placeholder="Your Name">
<input id="remail" type="email" placeholder="Email Address">
<input id="rpass" type="password" placeholder="Password">
<button onclick="register()">Register</button>
<p id="rmsg"></p></div>
</section>

<section id="login" class="hidden">
<div class="card"><h2>Member Login</h2>
<input id="lemail" type="email" placeholder="Email Address">
<input id="lpass" type="password" placeholder="Password">
<button onclick="login()">Login</button>
<p id="lmsg"></p></div>
</section>

<section id="dashboard" class="hidden">
<div class="card">
<h2>My Dashboard</h2>
<p id="welcome">Please login first.</p>
<div class="grid">
<div class="stat"><b id="mycount">0</b>My Websites</div>
<div class="stat"><b id="approved">0</b>Approved</div>
<div class="stat"><b id="visits">0</b>Total Visits</div>
</div>
</div>
<div class="card"><h3>Submit Your Website</h3>
<input id="sitename" placeholder="Website Name">
<input id="siteurl" placeholder="Website URL (https://...)">
<button onclick="submitSite()">Submit Website</button>
<p id="smsg"></p></div>
<div class="card"><h3>Discover Approved Websites</h3>
<button onclick="loadSites()">Refresh Websites</button>
<div id="sites">Login to discover websites.</div></div>
<div class="card"><h3>My Website History</h3><div id="history">No history yet.</div></div>
<div class="card hidden" id="admin">
<h2>Admin Panel</h2>
<h3>Website Approvals</h3><div id="adminsites"></div>
<h3>Advertisement Settings</h3>
<input id="bannerurl" placeholder="Banner image URL">
<input id="bannerlink" placeholder="Banner destination URL">
<input id="videourl" placeholder="Video URL (MP4)">
<button onclick="saveAds()">Save Advertisements</button>
<p id="admsg"></p>
</div>
</section>
</main>
<footer>Traffic Bot Pro | Genuine Voluntary Traffic Exchange</footer>

<script>
let token=localStorage.getItem("tbp_token")||"";
let user=null;
const $=id=>document.getElementById(id);
function show(id){
["home","register","login","dashboard"].forEach(x=>$(x).classList.add("hidden"));
$(id).classList.remove("hidden");
if(id==="dashboard")loadMe();
}
async function api(path,method="GET",data=null){
let opt={method,headers:{"Content-Type":"application/json","Authorization":"Bearer "+token}};
if(data)opt.body=JSON.stringify(data);
let r=await fetch("/api"+path,opt);
let j=await r.json();
if(!r.ok)throw Error(j.message||"Request failed");
return j;
}
async function register(){
try{
let x=await api("/register","POST",{name:$("rname").value,email:$("remail").value,password:$("rpass").value});
$("rmsg").textContent=x.message;
show("login");
}catch(e){$("rmsg").textContent=e.message}
}
async function login(){
try{
let x=await api("/login","POST",{email:$("lemail").value,password:$("lpass").value});
token=x.token;localStorage.setItem("tbp_token",token);
show("dashboard");
}catch(e){$("lmsg").textContent=e.message}
}
async function logout(){
try{await api("/logout","POST")}catch(e){}
token="";user=null;localStorage.removeItem("tbp_token");show("home");
}
async function loadMe(){
try{
let x=await api("/me");user=x.user;
$("welcome").textContent="Welcome, "+user.name+" | Account: "+user.email;
$("mycount").textContent=x.stats.sites;
$("approved").textContent=x.stats.approved;
$("visits").textContent=x.stats.visits;
$("admin").classList.toggle("hidden",!user.admin);
if(user.admin)loadAdmin();
loadSites();loadHistory();
}catch(e){$("welcome").textContent="Please login first. "+e.message}
}
async function submitSite(){
try{
let x=await api("/sites","POST",{name:$("sitename").value,url:$("siteurl").value});
$("smsg").textContent=x.message;
loadMe();
}catch(e){$("smsg").textContent=e.message}
}
async function loadSites(){
try{
let x=await api("/sites");
$("sites").innerHTML=x.sites.map(s=>
'<div class="site"><b>'+esc(s.name)+'</b><br>'+esc(s.url)+
'<br>Visits: '+s.visits+
'<br><button onclick="visitSite(\\''+s.id+'\\')">Visit Website</button></div>'
).join("")||"No approved websites yet.";
}catch(e){$("sites").textContent=e.message}
}
async function visitSite(id){
try{
let x=await api("/visit/"+id,"POST");
window.open(x.url,"_blank","noopener");
loadMe();loadHistory();
}catch(e){alert(e.message)}
}
async function loadHistory(){
try{
let x=await api("/history");
$("history").innerHTML=x.history.map(h=>
'<div class="site">'+esc(h.name)+' — '+esc(h.date)+' — '+esc(h.country)+'</div>'
).join("")||"No history yet.";
}catch(e){}
}
async function loadAdmin(){
try{
let x=await api("/admin/sites");
$("adminsites").innerHTML=x.sites.map(s=>
'<div class="site"><b>'+esc(s.name)+'</b><br>'+esc(s.url)+
'<br>Status: '+s.status+
'<br><button onclick="moderate(\\''+s.id+'\\',\\'approved\\')">Approve</button>'+
'<button onclick="moderate(\\''+s.id+'\\',\\'rejected\\')">Reject</button></div>'
).join("")||"No submitted websites.";
let a=await api("/ads");
$("bannerurl").value=a.banner||"";
$("bannerlink").value=a.bannerLink||"";
$("videourl").value=a.video||"";
}catch(e){$("adminsites").textContent=e.message}
}
async function moderate(id,status){
try{await api("/admin/moderate","POST",{id,status});loadAdmin()}
catch(e){alert(e.message)}
}
async function saveAds(){
try{
await api("/admin/ads","POST",{banner:$("bannerurl").value,bannerLink:$("bannerlink").value,video:$("videourl").value});
$("admsg").textContent="Advertisements saved.";
}catch(e){$("admsg").textContent=e.message}
}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
show("home");
</script>
</body>
</html>`;

const json=(data,status=200)=>new Response(JSON.stringify(data),{
status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}
});
const getId=()=>crypto.randomUUID();
const hash=async(password,salt)=>{
const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);
const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:new TextEncoder().encode(salt),iterations:100000,hash:"SHA-256"},key,256);
return [...new Uint8Array(bits)].map(x=>x.toString(16).padStart(2,"0")).join("");
};
const readJson=async r=>{try{return await r.json()}catch{return null}};
const getUser=async(req,env)=>{
let t=(req.headers.get("Authorization")||"").replace("Bearer ","");
if(!t)return null;
let id=await env.TRAFFIC_KV.get("session:"+t);
return id?await env.TRAFFIC_KV.get("user:"+id,"json"):null;
};
const save=async(env,key,value)=>env.TRAFFIC_KV.put(key,JSON.stringify(value));
const validUrl=u=>{try{let x=new URL(u);return x.protocol==="https:"||x.protocol==="http:"}catch{return false}};
const admin=(u,env)=>u&&u.email.toLowerCase()===(env.ADMIN_EMAIL||"").toLowerCase();

export default {
async fetch(request,env){
try{
if(!env.TRAFFIC_KV)return json({message:"KV binding TRAFFIC_KV is missing."},500);
const url=new URL(request.url),path=url.pathname,method=request.method;

if(method==="GET"&&path==="/")return new Response(PAGE,{headers:{"Content-Type":"text/html;charset=UTF-8"}});

if(path==="/api/register"&&method==="POST"){
let b=await readJson(request);
if(!b||!b.name||!b.email||!b.password||b.password.length<6)return json({message:"Name, email and password (minimum 6 characters) required."},400);
let email=b.email.trim().toLowerCase();
if(await env.TRAFFIC_KV.get("email:"+email))return json({message:"Email already registered."},409);
let id=getId(),salt=getId(),password=await hash(b.password,salt);
let u={id,name:b.name.trim(),email,salt,password,created:new Date().toISOString()};
await save(env,"user:"+id,u);
await env.TRAFFIC_KV.put("email:"+email,id);
return json({message:"Registration successful. Please login."});
}

if(path==="/api/login"&&method==="POST"){
let b=await readJson(request);
if(!b)return json({message:"Invalid request."},400);
let id=await env.TRAFFIC_KV.get("email:"+(b.email||"").trim().toLowerCase());
let u=id?await env.TRAFFIC_KV.get("user:"+id,"json"):null;
if(!u||await hash(b.password||"",u.salt)!==u.password)return json({message:"Incorrect email or password."},401);
let token=getId();
await env.TRAFFIC_KV.put("session:"+token,u.id,{expirationTtl:604800});
return json({token,message:"Login successful."});
}

if(!path.startsWith("/api/"))return json({message:"Not found"},404);

let u=await getUser(request,env);
if(path==="/api/logout"&&method==="POST"){
let t=(request.headers.get("Authorization")||"").replace("Bearer ","");
if(t)await env.TRAFFIC_KV.delete("session:"+t);
return json({message:"Logged out"});
}
if(!u)return json({message:"Please login first."},401);

if(path==="/api/me"&&method==="GET"){
let keys=await env.TRAFFIC_KV.list({prefix:"site:"}),mine=[],visits=0,approved=0;
for(let k of keys.keys){
let s=await env.TRAFFIC_KV.get(k.name,"json");
if(s&&s.userId===u.id){mine.push(s);visits+=s.visits||0;if(s.status==="approved")approved++}
}
return json({user:{name:u.name,email:u.email,admin:admin(u,env)},stats:{sites:mine.length,approved,visits}});
}

if(path==="/api/sites"&&method==="POST"){
let b=await readJson(request);
if(!b||!b.name||!validUrl(b.url))return json({message:"Website name and valid http/https URL required."},400);
let id=getId(),s={id,userId:u.id,name:b.name.trim(),url:b.url.trim(),status:"pending",visits:0,created:new Date().toISOString()};
await save(env,"site:"+id,s);
return json({message:"Website submitted. Waiting for admin approval."});
}

if(path==="/api/sites"&&method==="GET"){
let keys=await env.TRAFFIC_KV.list({prefix:"site:"}),sites=[];
for(let k of keys.keys){let s=await env.TRAFFIC_KV.get(k.name,"json");if(s&&s.status==="approved")sites.push(s)}
return json({sites});
}

if(path.startsWith("/api/visit/")&&method==="POST"){
let id=path.split("/").pop(),s=await env.TRAFFIC_KV.get("site:"+id,"json");
if(!s||s.status!=="approved")return json({message:"Website unavailable."},404);
if(s.userId===u.id)return json({message:"You cannot visit your own submitted website."},400);
s.visits=(s.visits||0)+1;
await save(env,"site:"+id,s);
let country=request.cf?.country||"Unknown";
let h={name:s.name,date:new Date().toISOString(),country};
let key="history:"+u.id,arr=await env.TRAFFIC_KV.get(key,"json")||[];
arr.unshift(h);arr=arr.slice(0,100);
await save(env,key,arr);
return json({url:s.url});
}

if(path==="/api/history"&&method==="GET"){
return json({history:await env.TRAFFIC_KV.get("history:"+u.id,"json")||[]});
}

if(path==="/api/ads"&&method==="GET"){
let a=await env.TRAFFIC_KV.get("settings:ads","json")||{};
return json(a);
}

if(path==="/api/admin/sites"&&method==="GET"){
if(!admin(u,env))return json({message:"Admin access required."},403);
let keys=await env.TRAFFIC_KV.list({prefix:"site:"}),sites=[];
for(let k of keys.keys){let s=await env.TRAFFIC_KV.get(k.name,"json");if(s)sites.push(s)}
return json({sites});
}

if(path==="/api/admin/moderate"&&method==="POST"){
if(!admin(u,env))return json({message:"Admin access required."},403);
let b=await readJson(request),s=b?.id?await env.TRAFFIC_KV.get("site:"+b.id,"json"):null;
if(!s||!["approved","rejected"].includes(b.status))return json({message:"Invalid website or status."},400);
s.status=b.status;await save(env,"site:"+s.id,s);
return json({message:"Website status updated."});
}

if(path==="/api/admin/ads"&&method==="POST"){
if(!admin(u,env))return json({message:"Admin access required."},403);
let b=await readJson(request);
if(!b)return json({message:"Invalid request."},400);
await save(env,"settings:ads",{banner:b.banner||"",bannerLink:b.bannerLink||"",video:b.video||""});
return json({message:"Ads settings saved."});
}

return json({message:"API route not found."},404);
}catch(e){
return json({message:"Server error. Check Worker logs.",detail:String(e)},500);
}
}
};
