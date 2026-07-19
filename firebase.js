import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQ5CO4sLv_8j22N0YJyQmz8hIZpMs6DhE",
  authDomain: "lhop01-admin.firebaseapp.com",
  databaseURL: "https://lhop01-admin-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lhop01-admin",
  storageBucket: "lhop01-admin.firebasestorage.app",
  messagingSenderId: "382345315199",
  appId: "1:382345315199:web:fafa4d6ee8d82e1d97104a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.loadPanelSettings = function(){

    onValue(ref(db,"settings"), (snapshot)=>{

        const data = snapshot.val();

        if(!data) return;

        if(document.getElementById("owner")){
            document.getElementById("owner").innerText =
                "OWNER: " + (data.ownerName || "LHOP01");
        }

        if(document.getElementById("announcementText")){
            document.getElementById("announcementText").innerText =
                data.announcement || "Panel Successfully Working...";
        }

        if(data.themeColor){
            document.documentElement.style.setProperty(
                "--theme-color",
                data.themeColor
            );
        }

    });

}

window.saveKey = function(key, days, buyer){

    const id = push(ref(db,"keys"));

    set(id,{
    key: key,
    buyer: buyer,  
    validity: days,
    status: "active",
    hwid: "",
    lastLogin: 0,  
    created: Date.now(),
    expire: Date.now() + (Number(days) * 24 * 60 * 60 * 1000)
});
    addLog("🔑 Generated Key : " + key);
}




window.loadKeys=function(){

const table=document.getElementById("keyTable");
const search = document.getElementById("searchKey").value.toLowerCase();
const filter = document.getElementById("statusFilter").value;
  
onValue(ref(db,"keys"),(snapshot)=>{
let buyers = new Set();

keys.forEach((item)=>{

const data = item.data;
const id = item.id;
  
table.innerHTML=`

<tr>
<th>Key</th>
<th>Validity</th>
<th>Status</th>
</tr>

`;

let total = 0;
let active = 0;
let expired = 0;
let lifetime = 0;  
let hwids = 0;
let todayKeys = 0;
let weekKeys = 0;
let monthKeys = 0;
  
const today = new Date().toDateString();  
const keys = [];
const recent = [];
snapshot.forEach((item)=>{
    keys.push({
        id: item.key,
        data: item.val()
    });
});

const sort = document.getElementById("sortType").value;

if(sort == "new"){
    keys.sort((a,b)=> b.data.created - a.data.created);
}else{
    keys.sort((a,b)=> a.data.created - b.data.created);
}

table.innerHTML = `
<tr>
<th>Key</th>
<th>Buyer</th>
<th>Validity</th>
<th>Status</th>
<th>Action</th>
<th>HWID</th>
</tr>
`;


    });

}  
  


recent.push(
`🔑 ${data.key} - ${data.buyer || "Unknown"}`
);
  
if(data.created){

    const keyDate = new Date(data.created).toDateString();

    if(keyDate === today){
        todayKeys++;
    }

}  

const now = new Date();
const created = new Date(data.created);

const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

if(diffDays <= 7){
    weekKeys++;
}

if(diffDays <= 30){
    monthKeys++;
}
  
if(data.buyer){
    buyers.add(data.buyer);
}  
  
if(data.hwid){
    hwids++;
}
  
const keyMatch = data.key.toLowerCase().includes(search);
const buyerMatch = (data.buyer || "").toLowerCase().includes(search);

if (!keyMatch && !buyerMatch) {
    return;
}
  
if (data.validity != "9999" &&
    data.status !== "expired" &&
    Date.now() > data.expire) {

    update(ref(db, "keys/" + id), {
        status: "expired"
    });

    data.status = "expired";
}
  
total++;

if(data.status !== "Active"){
    active++;
}

if(data.validity == "9999"){
    lifetime++;
}

if(data.status === "expired"){
    expired++;
}  

if(filter === "active" && data.status !== "active"){
    return;
}

if(filter === "Expired" && data.status !== "expired"){
    return;
}

if(filter === "lifetime" && data.validity !== "9999"){
    return;
}
  
table.innerHTML += `
<tr>
<td>${data.key}</td>
<td>${data.buyer || "-"}</td>
<td>${data.hwid || "Not Bound"}</td>
<td>${data.validity}</td>
<td>
<span class="${data.status}">
${data.status}
</span>
</td>

<td>

<button onclick="copyKey('${data.key}')">
Copy
</button>

<button onclick="editKey('${id}')">
Edit
</button>

<button onclick="revokeKey('${id}')">
Revoke
</button>

<button onclick="resetHWID('${id}')">Reset HWID</button>

<td>
<span class="status-${data.status}">
${data.status}
</span>
</td>

<button onclick="deleteKey('${id}')">
Delete
</button>

</td>
</tr>
`;

});

document.getElementById("totalBuyers").innerText = buyers.size;  
document.getElementById("totalKeys").textContent = total;
document.getElementById("activeKeys").textContent = active;
document.getElementById("expiredKeys").textContent = expired;
document.getElementById("lifetimeKeys").textContent = lifetime;
document.getElementById("totalHwids").innerText = hwids;  
document.getElementById("todayKeys").innerText = todayKeys;
document.getElementById("weekKeys").innerText = weekKeys;
document.getElementById("monthKeys").innerText = monthKeys;
const activity = document.getElementById("recentActivity");

updateDashboardChart(
    total,
    active,
    expired,
    lifetime
);

if(activity){

    activity.innerHTML = "";

    recent.slice(0,5).forEach(item=>{

        activity.innerHTML += `<li>${item}</li>`;

    });

}
  
});

}



window.deleteKey = function(id){

if(!confirm("Are you sure you want to delete this key?")){
    return;
}

remove(ref(db,"keys/"+id));
addLog("🗑️ Key Deleted");
showToast("🗑️ Key Deleted Successfully");

}

onValue(ref(db, "settings"), (snapshot) => {

  const data = snapshot.val();

  if (!data) return;

  if (data.maintenance === true) {

    document.body.innerHTML = `
      <div style="padding:40px;text-align:center;color:white;">
        <h1>🚧 Website Under Maintenance</h1>
        <p>Please try again later.</p>
      </div>
    `;

  }

});

window.editKey = function(id){

const days = prompt("Enter new validity (1,3,7,15,30,365,9999)");

if(days == null || days == ""){
    return;
}

update(ref(db,"keys/"+id),{
    validity: days,
    expire: Date.now() + (Number(days) * 24 * 60 * 60 * 1000)
});
addLog("✏️ Key Edited");
showToast("✏️ Key Updated Successfully");
}

window.revokeKey = function(id){

update(ref(db,"keys/"+id),{
    status:"revoked"
});
addLog("🚫 Key Revoked");
showToast("🚫 Key Revoked Successfully");

}

window.copyKey = function(key){

navigator.clipboard.writeText(key);

showToast("📋 Key Copied Successfully");

}

function addLog(action){

    push(ref(db, "logs"), {
        action: action,
        time: Date.now()
    });

}

window.exportKeys = function(){

let csv = "Key,Buyer,Validity,Status\n";

onValue(ref(db,"keys"),(snapshot)=>{

snapshot.forEach((item)=>{

const data = item.val();

csv += `${data.key},${data.buyer || ""},${data.validity},${data.status}\n`;

});

const blob = new Blob([csv], {type:"text/csv"});
const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "LHOP01_Keys.csv";
a.click();

URL.revokeObjectURL(url);

},{onlyOnce:true});

}



saveKey(key, days);

alert("Custom Key Saved");

document.getElementById("customKey").value="";
document.getElementById("customDays").value="";

}

window.bindHWID = function(id, hwid){

    update(ref(db, "keys/" + id), {
        hwid: hwid,
        lastLogin: Date.now()
    });

}

window.updateLastLogin = function(id){

    update(ref(db, "keys/" + id), {
        lastLogin: Date.now()
    });

}

window.getKeyData = function(callback){

    onValue(ref(db, "keys"), (snapshot)=>{

        const keys = [];

        snapshot.forEach((item)=>{
            keys.push({
                id: item.key,
                data: item.val()
            });
        });

        callback(keys);

    }, {
        onlyOnce: true
    });

}

window.resetHWID = function(id){

    if(!confirm("Reset HWID for this key?")){
        return;
    }

    update(ref(db, "keys/" + id), {
        hwid: ""
    });
    addLog("🔄 HWID Reset");
    showToast("🔄 HWID Reset Successfully");

}

window.searchKeys = function(){

    const input = document.getElementById("searchBox").value.toLowerCase();

    const table = document.getElementById("keyTable");

    const rows = table.getElementsByTagName("tr");

    for(let i = 1; i < rows.length; i++){

        const text = rows[i].innerText.toLowerCase();

        if(text.includes(input)){
            rows[i].style.display = "";
        }else{
            rows[i].style.display = "none";
        }

    }

}


    const blob = new Blob([csv], {type:"text/csv"});

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "LHOP01_Keys.csv";

    a.click();

}

let dashboardChart = null;

function updateDashboardChart(total, active, expired, lifetime) {

    const canvas = document.getElementById("dashboardChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (dashboardChart) {
        dashboardChart.destroy();
    }

    dashboardChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Total", "Active", "Expired", "Lifetime"],
            datasets: [{
                label: "Keys",
                data: [total, active, expired, lifetime]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

  }

    window.exportPDF = function(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("LHOP01 Admin Panel Report", 20, 20);

    doc.setFontSize(12);

    doc.text(
        "Total Keys : " +
        document.getElementById("totalKeys").textContent,
        20,
        40
    );

    doc.text(
        "Active Keys : " +
        document.getElementById("activeKeys").textContent,
        20,
        50
    );

    doc.text(
        "Expired Keys : " +
        document.getElementById("expiredKeys").textContent,
        20,
        60
    );

    doc.text(
        "Lifetime Keys : " +
        document.getElementById("lifetimeKeys").textContent,
        20,
        70
    );

    doc.save("LHOP01_Report.pdf");

}

window.importCSV = function(event){

    const file = event.target.files[0];

    if(!file){
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){

        const rows = e.target.result.split("\n");

        rows.shift();

        rows.forEach(row=>{

            if(!row.trim()) return;

            const cols = row.split(",");

            const key = cols[0]?.trim();
            const buyer = cols[1]?.trim();
            const validity = cols[2]?.trim();
            const status = cols[3]?.trim();

            saveKey(key, validity, buyer);

        });

        showToast("✅ CSV Imported Successfully");

    };

    reader.readAsText(file);

}

});
}
