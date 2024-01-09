function ReDirect(){
    window.location.href = window.location.origin+"/client/AuthPage/login.html";
}
function CheckUser(){
    if(window.localStorage.getItem("Authoraization")!=null){
        window.location.href = window.location.origin+"/client/home.html";
    };
}
CheckUser();
document.getElementById("SignUpForm").addEventListener('submit',async(e)=>{
    e.preventDefault();
    let UserData={};
    let formData=new FormData(e.target);
    formData.forEach((value, key) => {
        UserData[key]=value;
    });
    let response=await fetch("http://localhost:5000/signup",{
        method:"POST",
        body:JSON.stringify(UserData),
        headers:{
            "content-type":"application/json"
        }
    }).then((json)=>{
        return json.json();
    }).then((data)=>{
        if(data.status){
            ReDirect();
        }else{
            console.log("Sign Up - Fail : ",data)
        }
    }).catch((err)=>{
        console.log("SIGNUP ERROR : ",err);
    })
});