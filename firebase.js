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

window.saveKey = function(key, days){

    const id = push(ref(db,"keys"));

    set(id,{
    key: key,
    validity: days,
    status: "active",
    created: Date.now(),
    expire: Date.now() + (Number(days) * 24 * 60 * 60 * 1000)
});

}




window.loadKeys=function(){

const table=document.getElementById("keyTable");

onValue(ref(db,"keys"),(snapshot)=>{

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

snapshot.forEach((item)=>{

const data=item.val();
const id=item.key;  

if (data.validity != "9999" &&
    data.status !== "expired" &&
    Date.now() > data.expire) {

    update(ref(db, "keys/" + id), {
        status: "expired"
    });

    data.status = "expired";
}
  
total++;

if(data.status === "active"){
    active++;
}

if(data.validity == "9999"){
    lifetime++;
}

if(data.status === "expired"){
    expired++;
}  

table.innerHTML += `
<tr>
<td>${data.key}</td>
<td>${data.validity}</td>
<td>${data.status}</td>
<td>
<button onclick="deleteKey('${id}')">
Delete
</button>
</td>
</tr>
`;

});

document.getElementById("totalKeys").textContent = total;
document.getElementById("activeKeys").textContent = active;
document.getElementById("expiredKeys").textContent = expired;
document.getElementById("lifetimeKeys").textContent = lifetime;
  
});

}



window.deleteKey = function(id){

remove(ref(db,"keys/"+id));

alert("Key Deleted Successfully");

}

window.createCustomKey = function(){

const key = document.getElementById("customKey").value;
const days = document.getElementById("customDays").value;

if(key=="" || days==""){
    alert("Fill all fields");
    return;
}

saveKey(key, days);

alert("Custom Key Saved");

document.getElementById("customKey").value="";
document.getElementById("customDays").value="";

}
