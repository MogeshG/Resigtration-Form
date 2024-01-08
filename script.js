document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("email").addEventListener("input", function() {
        var gmail = document.getElementById('email').value;
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(gmail)) {
            document.getElementById('emailError').innerHTML = "Enter a valid email address";
        } 
        else {
            document.getElementById('emailError').innerHTML = "";
        }
    });

    document.getElementById('phone').addEventListener('input',function() {
        var phone = document.getElementById('phone').value;
        var phoneRegex = /^[6-9]{1}[0-9]{9}$/;
        if(!phoneRegex.test(phone)) {
            document.getElementById('phoneError').innerHTML = "Enter a valid Mobile Number";
        }
        else{
            document.getElementById('phoneError').innerHTML = "";
        }
    });

    document.getElementById('dob').addEventListener('input',function() {
        var dob = document.getElementById('dob').value;
        var birthdate=new Date(dob);
        var year=birthdate.getFullYear();
        if(!(year>=1950 && year<=2010)){
            document.getElementById('dobError').innerHTML = "Enter year between 1950-2010";
        }
        else{
            document.getElementById('dobError').innerHTML = "";
        }
    });

    document.getElementById('pan').addEventListener('input',function() {
        var pan = document.getElementById('pan').value;
        var panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if(!panRegex.test(pan)){
            document.getElementById('panError').innerHTML = "Enter valid Password";
        }
        else{
            document.getElementById('panError').innerHTML = "";
        }
    });

    document.getElementById('username').addEventListener('input', function() {
        var username = this.value;
        var storedData = JSON.parse(localStorage.getItem('allUserData')) || [];
        var usernameExists = storedData.some(data => data.username === username);
        var usernameErrorElement = document.getElementById('usernameError');
        if (usernameExists) {
            usernameErrorElement.innerHTML = "Username already exists!";
        } else {
            usernameErrorElement.innerHTML = "";
        }
    });    

    document.getElementById('photo').addEventListener('change',function() {
        var photo = document.getElementById('photo');
        var photosize=photo.files[0].size;
        if (photosize< (2*1024*1024) || photosize===null) {
            document.getElementById('photoError').innerHTML = "";
        }
        else{
            document.getElementById('photoError').innerHTML = "Image size must be less than 2MB";
        }
    });

    document.getElementById('password').addEventListener('input',function() {
        var password = document.getElementById('password').value;
        var passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password)){
            document.getElementById('passwordError').innerHTML = "Password must contain 1 uppercase, 1 lowercase, 1 Number, 1 Special Character";
        }
        else{
            document.getElementById('passwordError').innerHTML = "";
        }
    });

    addEventListener('keydown', function(event){
        if(event.key === "Enter"){
            var searchInput=document.getElementById('searchInput');
            if(document.activeElement===searchInput)
            {
                search();
                event.preventDefault();
            }
            else{
                save();
            }
        }
    });
    
    document.getElementById('searchInput'),addEventListener('input',function(){
        document.getElementById('searchError').innerHTML="";
    });
});
    function save(event) {
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var dob = document.getElementById('dob').value;
        var gender = document.getElementById('gender').value;
        var occupation = document.getElementById('occupation').value;
        var education = document.getElementById('education').value;
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var pan = document.getElementById('pan').value;
        var val= validateAge();
        var flag=0;

        var fileInput = document.getElementById('photo');
        var file = fileInput.files[0];
        var ftype=file.type;
        var fsize=file.size;
        var reader = new FileReader();
        var errorMsgElements = document.getElementsByClassName('error');

        for (var i = 0; i < errorMsgElements.length; i++) {
            if (errorMsgElements[i].innerText.trim() !== '') {
                event.preventDefault();
                flag=1;
            }
        }
    if(flag===0){
        reader.onload= function(event) {
            var base64Image = event.target.result;

            var formData = {
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                gender: gender,
                occupation: occupation,
                age: val,
                education: education,
                username: username,
                password: password,
                pan: pan,
                photo: base64Image,
                file:{ftype,fsize}
            };
            var storedData = JSON.parse(localStorage.getItem('allUserData')) || [];
            storedData.push(formData);
            var allUserDataJSON = JSON.stringify(storedData);
            localStorage.setItem('allUserData', allUserDataJSON);
            alert("Data Added Successfully");
            window.location.reload();

            var allInputs = document.querySelectorAll('input');
            allInputs.forEach(singleInput => singleInput.value = '');
        };
        reader.readAsDataURL(file);
    }
    }

    function backToForm(){
        var backForm = document.getElementById('backForm');
        var container = document.getElementById('searchResultsContainer');
        container.style.display = 'none';
        backForm.style.display='block';

    }

    function validateAge(){
        var dateInput=document.getElementById('dob').value;
        var birthdate=new Date(dateInput);
        var currentDate=new Date();
        var age=currentDate.getFullYear()- birthdate.getFullYear()-1;
        return age;
    }

    function search() {
        
        var searchInput = document.getElementById('searchInput').value.toLowerCase();

        if (searchInput == "") {
            document.getElementById('searchError').innerHTML="Enter anything to search";
            return;
        }
        // if(searchInput < 3){
        //     var storedData = JSON.parse(localStorage.getItem('allUserData')) || [];
        //     var searchResults = storedData.filter(data => data.file.fsize < (searchInput*1024*1024));
        //     console.log(searchResults)
        //     displaySearchResults(searchResults);          
        // }
        else if(searchInput > 3){
            var storedData = JSON.parse(localStorage.getItem('allUserData')) || [];
            var searchResults = storedData.filter(data => data.age < (searchInput/365));
            console.log(searchResults)
            displaySearchResults(searchResults);          
        }
        else if(searchInput.typeof='string'){
            var match = searchInput.match(/^(\d+)([mMkK]?[bB]?)$/);

            if (match) {
                var numericValue = parseFloat(match[1]);
                var unit = match[2].toLowerCase();
            
                var searchInputBytes = (unit === 'kb' ? numericValue * 1024 : numericValue * 1024 * 1024);
            
                var storedData = JSON.parse(localStorage.getItem('allUserData')) || [];
                var searchResults = storedData.filter(data => data.file.fsize < searchInputBytes);
                console.log(searchResults);
                displaySearchResults(searchResults);
            } else {
                var storedData = JSON.parse(localStorage.getItem('allUserData')) || [];
                var searchResults = storedData.filter(data => data.name.toLowerCase()===searchInput.toLowerCase());
                displaySearchResults(searchResults);
            }
        }
    }

    function displaySearchResults(results) {
        var container = document.getElementById('searchResultsContainer');
        var backForm = document.getElementById('backForm');
        let flag=1;
        container.textContent = '';

        console.log(results.length);

        for(i=0;i<=results.length;i++){
        if (results[i]) {
            container.style.display = 'block';
            backForm.style.display='none';
            var resultItem = document.createElement('div');
            // resultItem.innerHTML +="<p>User Details:</p>";
            resultItem.innerHTML = `<img src="${results[i].photo}" width="120" height="100">`;
            resultItem.innerHTML +=`<p><strong>Name:</strong>${results[i].name}</p>`;
            resultItem.innerHTML +=`<p><strong>Email:</strong> ${results[i].email}</p>`;
            resultItem.innerHTML +=`<p><strong>Phone:</strong> ${results[i].phone}</p>`;
            resultItem.innerHTML +=`<p><strong>DOB:</strong> ${results[i].dob}</p>`;
            resultItem.innerHTML +=`<p><strong>Age:</strong> ${results[i].age}</p>`;
            resultItem.innerHTML +=`<p><strong>Gender:</strong> ${results[i].gender}</p>`;
            resultItem.innerHTML +=`<p><strong>Occupation:</strong> ${results[i].occupation}</p>`;
            resultItem.innerHTML +=`<p><strong>Education:</strong> ${results[i].education}</p>`;
            resultItem.innerHTML +=`<p><strong>Username:</strong> ${results[i].username}</p><br><br>`;
            container.appendChild(resultItem);
            resultItem.classList.add('aligned-content');
            flag=0;

        }
        }
        if(flag==0){
            resultItem.innerHTML +=`<button id="back"  onclick="backToForm()">Back</button>`;
        }
        else{
            container.style.display = 'none';
            document.getElementById('searchError').innerHTML = 'No matching records found.';
        }
    }

    function togglePassword(){
        var password=document.getElementById('password');
        var eyeicon=document.getElementById('eyeicon');
        if(password.type==='password')
        {
            password.type='text';
            eyeicon.src='eye-open.svg';
            
        }
        else{
            password.type='password';
            eyeicon.src='eye-close.svg';
        }
    }