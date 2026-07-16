function randomPart(length){
const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let out="";
for(let i=0;i<length;i++){
out+=chars[Math.floor(Math.random()*chars.length)];
}
return out;
}

if(localStorage.getItem("adminLogin") !== "true"){
    window.location.href = "login.html";
}

function generateKey(){

const days=document.getElementById("days").value;
const buyer = document.getElementById("buyerName").value;
const key="LHOP01-"+randomPart(4)+"-"+randomPart(4);

document.getElementById("result").innerHTML=key;

saveKey(key, days, buyer);

alert("Key Saved Successfully");

}

function generateCustomKey() {
    const key = document.getElementById("customKey").value;
    const days = document.getElementById("customDays").value;

    if (key === "" || days === "") {
        alert("Fill all fields");
        return;
    }

    saveKey(key, days, "-");
    alert("Custom Key Saved Successfully");

    document.getElementById("customKey").value = "";
    document.getElementById("customDays").value = "";
}



window.onload=function(){

loadKeys();

}

function logout(){

localStorage.removeItem("adminLogin");

window.location.href = "login.html";

}
