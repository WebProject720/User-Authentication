document.getElementById("SignUpForm").addEventListener('submit',(e)=>{
    e.preventDefault();
    let formData=new FormData(e.target);
    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });
})