function randomPart(length){
const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let out="";
for(let i=0;i<length;i++){
out+=chars[Math.floor(Math.random()*chars.length)];
}
return out;
}

function generateKey(){

const days=document.getElementById("days").value;

const key="LHOP01-"+randomPart(4)+"-"+randomPart(4);

document.getElementById("result").innerHTML=key;

saveKey(key,days);

alert("Key Saved Successfully");

}

function generateCustomKey(){

const key=document.getElementById("customKey").value;

document.getElementById("result").innerHTML=key;

}
