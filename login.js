function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

if(username === "admin" && password === "123456"){

localStorage.setItem("adminLogin","true");

window.location.href = "index.html";

}else{

alert("Invalid Username or Password");

}

}
