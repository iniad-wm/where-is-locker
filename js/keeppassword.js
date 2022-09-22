let inputuserid = document.getElementById("user");

inputuserid.addEventListener('change', (event) => {
  const result = document.querySelector('.result');
  localStorage.setItem("userid", event.target.value);
});

let inputuserpass = document.getElementById("pass");
inputuserpass.addEventListener('change', (event) => {
  const result = document.querySelector('.result');
  localStorage.setItem("userpass", event.target.value);
});

function setuserid() {
  document.getElementById("user").value = localStorage.getItem("userid");
  document.getElementById("pass").value = localStorage.getItem("userpass");

}

window.onload = function(){
  document.getElementById("user").value = localStorage.getItem("userid");
  document.getElementById("pass").value = localStorage.getItem("userpass");

}