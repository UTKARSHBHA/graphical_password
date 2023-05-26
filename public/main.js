const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
let uppass = [];
let inpass = [];


var signupform = document.getElementById("signupform");
function handleForm(event) { event.preventDefault(); }
signupform.addEventListener('submit', handleForm);

var signinform = document.getElementById("signinform");
function handleForm(event) { event.preventDefault(); }
signinform.addEventListener('submit', handleForm);





signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});


signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});
// adding and removing border
function upimg(element) {
    var Image = element.querySelector('img');
    if (Image) {
        if (Image.classList.contains('clicked')) {
            Image.classList.remove('clicked');
            uppass.splice(uppass.indexOf(element.id), 1);
        }
        else {
            Image.classList.add('clicked');
            uppass.push(element.id);
        }
    }
}

function inimg(element) {
    var Image = element.querySelector('img');
    if (Image) {
        if (Image.classList.contains('clicked')) {
            Image.classList.remove('clicked');
            inpass.splice(inpass.indexOf(element.id), 1);
        }
        else {
            Image.classList.add('clicked');
            inpass.push(element.id);
        }
    }
}
// element image recognition

var captcha;
function generate() {

    // Clear old input
    document.getElementById("submit").value = "";

    // Access the element to store
    // the generated captcha
    captcha = document.getElementById("image");
    var uniquechar = "";

    const randomchar =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // Generate captcha for length of
    // 5 with random character
    for (let i = 1; i < 5; i++) {
        uniquechar += randomchar.charAt(
            Math.random() * randomchar.length)
    }

    // Store generated input
    captcha.innerHTML = uniquechar;
}


function signup() {

    const usr_input = document
        .getElementById("submit").value;

    // Check whether the input is equal
    // to generated captcha or not
    if (usr_input == captcha.innerHTML) {
        var s = document.getElementById("key")
            .innerHTML = "Matched";
        generate();

        let useremail = document.getElementById('upmail').value;
        let userpassword = uppass.toString();
        let userd = {
            email: useremail,
            password: userpassword
        }

        const signunpost = async () => {
            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userd)
                });
                const data = await response;
                console.log(data);
                if (data.status === 200) {
                    var myText = "Account Created Succesfully";
                    alert(myText);
                } else if (data.status === 401) {
                    alert("email already registered");
                }
                else {

                }
            } catch (error) {

                console.log(error)
            }
        }

        signunpost()

    }
    else {
        var s = document.getElementById("key")
            .innerHTML = "not Matched";
        generate();
    }



}

// image pattern authentication
var v2 = new Boolean(false);
function signin() {
    let logindata = {
        email: document.getElementById('inmail').value,
        password: inpass.toString()
    }


    const signinpost = async () => {
        try {
            const response = await fetch('/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logindata)
            });
            const data = await response;
            console.log("in await");

            console.log(data);
            if (data.status === 200) {
                NewTab();
            }
            else {
                var myText = "Login Failed";
                alert(myText);

                sendMail3();

            }
        }
        catch (error) {

            console.log(error)
        }
    }

    signinpost()
}



function sendMail3() {
    var templateParams = {
        email_id: document.getElementById('inmail').value,
        message: "Looks like someone is trying to get in. If it's not you contact gpa."
    };
    emailjs.send('service_466g1gh', 'template_pvmk4x5', templateParams)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function (error) {
            console.log('FAILED...', error);
        });

}

function NewTab() {
    window.open(
        "https://www.ipec.org.in/", "_blank");
}


