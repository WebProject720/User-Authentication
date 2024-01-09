function ReDirect() {
    window.location.href = window.location.origin + "/client/home.html";
}
function StoreToken(token) {
    window.localStorage.setItem("Authoraization", `Bearer ${token}`);
}
function CheckUser() {
    if (window.localStorage.getItem("Authoraization") != null) {
        ReDirect();
    }
}
CheckUser()
document.getElementById("LoginForm").addEventListener('submit', async (e) => {
    e.preventDefault();
    let UserData = {};
    let formData = new FormData(e.target);
    formData.forEach((value, key) => {
        UserData[key] = value;
    });
    let response = await fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify(UserData),
        headers: {
            "content-type": "application/json"
        }
    }).then((json) => {
        console.log(json);
        return json.json();
    }).then((data) => {
        if (data.status) {
            StoreToken(data.token)
            ReDirect();
        } else {
            console.log("Login : Failled : ", data)
        }
    }).catch((err) => {
        console.log("Login ERROR : ", err);
    })
});