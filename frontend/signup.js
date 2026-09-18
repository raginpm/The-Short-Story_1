// <input id = "signupName" type = "text" placeholder="Name">
//<input id = "signupEmail" type = "email" placeholder="Email">
 //       <input id = "signupPassword" type = "password" placeholder="Password">
 //       <button id = "signupButton" class = "signup-button" >Create Account</button>

const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupButton = document.getElementById("signupButton");

signupButton.addEventListener("click", function(){
    const name = signupName.value;
    const email = signupEmail.value;
    const password = signupPassword.value;

    const userObject = {
        userName: name,
        email:email,
        password:password
    }
    console.log(userObject);
    fetch("http://localhost:8080/auth/signup",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userObject)
    }).then(function(response) {
        if(response.status === 409){
            alert("User name or email already exists");
            return;
        }
        if(!response.ok){
            throw new Error("Signup failed");
        }
        if (response.ok) {
            //localStorage.clear();
            window.location.replace("login.html");
        }
    }).catch(function (error) {
        console.error(error);
        alert("Unable to create account");
    });
});

