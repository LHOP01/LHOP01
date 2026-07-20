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

if(buyer.trim()===""){
    showToast("⚠️ Enter Buyer Name");
    return;
}    
saveKey(key, days, buyer);

showToast("✅ Key Generated Successfully");

}

function generateCustomKey() {
    const key = document.getElementById("customKey").value;
    const days = document.getElementById("customDays").value;

    if (key === "" || days === "") {
        showToast("⚠️ Fill all fields");
        return;
    }

    saveKey(key, days, "-");
    showToast("✅ Custom Key Saved Successfully");

    document.getElementById("customKey").value = "";
    document.getElementById("customDays").value = "";
}



window.onload = function(){

    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "light"){
        document.body.classList.add("light-theme");
    }

    loadPanelSettings();

    loadKeys();

}

function logout(){

localStorage.removeItem("adminLogin");

window.location.href = "login.html";

}

window.showToast = function(message){

    const toast = document.getElementById("toast");

    if(!toast) return;

    toast.innerText = message;

    toast.style.display = "block";

    setTimeout(()=>{
        toast.style.right = "20px";
    },10);

    setTimeout(()=>{
        toast.style.right = "-350px";
    },2500);

    setTimeout(()=>{
        toast.style.display = "none";
    },2900);

}

window.toggleTheme = function(){

    document.body.classList.toggle("light-theme");

    if(document.body.classList.contains("light-theme")){
        localStorage.setItem("theme","light");
    }else{
        localStorage.setItem("theme","dark");
    }

}
