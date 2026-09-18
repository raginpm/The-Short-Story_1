
const loginButton = document.querySelector("#loginButton");
const loginIdentifier = document.querySelector("#identifier");
const loginPassword = document.querySelector("#password");
const existingToken = localStorage.getItem("token");

if (existingToken) {
    window.location.replace("index.html");
}

loginButton.addEventListener("click", function () {

    const loginRequest = {
        identifier: loginIdentifier.value,
        password: loginPassword.value
    };

    fetch("http://localhost:8080/auth/login", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginRequest)
    })
    .then(function (response) {

        if(response.status === 401){
            alert("Invalid username/email or password");
            return;
        }
        if (!response.ok) {
            throw new Error("Login failed");
        }
        return response.json();
    })
    .then(function (result) {
        if(result == undefined){
            alert("Invalid username/email or password");
            return;
        }
        localStorage.clear();
        localStorage.setItem("token", result.token);
        window.location.replace("index.html");
    })
    .catch(function (error) {
        console.error(error);
        alert("Invalid username/email or password");
    });
});