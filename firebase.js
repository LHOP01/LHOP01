import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove
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
        key:key,
        validity:days,
        status:"active",
        created:Date.now()
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

total++;

if(data.status === "active"){
    active++;
}

if(data.validity == "9999"){
    lifetime++;
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
