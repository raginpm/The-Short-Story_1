const nationality = document.querySelector("#nationality");
const hometown = document.querySelector("#hometown");
const saveProfileButton = document.querySelector("#saveProfileButton");
const token = localStorage.getItem("token");
const skipProfileButton = document.querySelector("#skipProfileButton");

loadProfile();

skipProfileButton.addEventListener("click", function(){
    window.location.replace("index.html");
});

function loadProfile(){
    fetch("http://localhost:8080/users/me/profile",{
        method:"GET",
        headers:{
            "Authorization":"Bearer "+token
        }
    }).then(function(response){
        if(response.status === 401){
            localStorage.removeItem("token");
            window.location.replace("login.html");
            return;
        }
        if(!response.ok){
            throw new Error("Failed to load profile");
        }
        return response.json();
    }).then(function(profile){
        if(profile == undefined || profile == null){
            alert("Profile not found");
            return;
        }
        nationality.value = profile.nationality || "";
        hometown.value = profile.hometown || "";
        if(profile.gender!=null){
            const genderRadio =
                document.querySelector(
                    'input[name="gender"][value="' +
                    profile.gender +
                    '"]'
                );
            if(genderRadio != null){
                genderRadio.checked = true;
            }
        }
    }).catch(function(error){
        console.error(error);
        alert("Unable to load profile");
    });
    
    saveProfileButton.addEventListener("click", function(){
        const selectedGender = document.querySelector(
            'input[name="gender"]:checked');
        
        let gender = null;
        if(selectedGender != null){
            gender = selectedGender.value;
        }   
        const profile = {
            nationality: nationality.value,
            hometown:hometown.value,
            gender:gender
        }
        updateProfile(profile);
    });

    function updateProfile(profile){
        fetch("http://localhost:8080/users/me/profile",{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+token
            },
            body:JSON.stringify(profile)
        }).then(function(response){
            if(response.status ==401){
                localStorage.removeItem("token");
                window.location.replace("login.html");
                return;
            }
            if(!response.ok){
                throw new Error("Failed to update profile");
            }
            alert("Profile updated successfully");
            window.location.replace("index.html");
        
        }).catch(function(error){
            console.error(error);
            alert("Unable to update profile");
        });
    }
                
}