'use strict';

let getMakeCredentialsChallenge = (formBody) => {
    return fetch('/webauthn/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
    })
    .then((response) => response.json())
    .then((response) => {
        if(response.status !== 'ok')
            throw new Error(`Server responed with error. The message is: ${response.message}`);

        return response
    })
}

let sendWebAuthnResponse = (body) => {
    return fetch('/webauthn/response', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((response) => {
        console.log(response)
        if(response.status !== 'ok')
            throw new Error(`Server responed with error. The message is: ${response.message}`);

        return response
    })
}

/* Handle for register form submission */
$('#card-form').submit(function(event) {
    event.preventDefault();

    let username = this.number.value;
    let password = this.expDate.value;
    let name     = "testFakeHolder";

    // let username = this.username.value;
    // let password = this.password.value;

    console.log("in #register " + username + " " + name + " " + password);
    

    if(!username || !name || !password) {
        console.log('Name , username or password is missing!')
        return
    }

    getMakeCredentialsChallenge({username, name, password})
        .then((response) => {
            let publicKey = preformatMakeCredReq(response);
            return navigator.credentials.create({ publicKey })
        })
        .then((response) => {
            let makeCredResponse = publicKeyCredentialToJSON(response);
            console.log(makeCredResponse)
            makeCredResponse.isLoginAuthType = false;
            return sendWebAuthnResponse(makeCredResponse)
        })
        .then((response) => {
            if(response.status === 'ok') {
                console.log("success")
                window.location.replace("http://localhost:8080")
            } else {
                console.log(`Server responed with error. The message is: ${response.message}`);
            }
        })
        .catch((error) => console.log(error))
})

let getGetAssertionChallenge = (formBody) => {
    console.log(formBody);
    return fetch('/webauthn/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
    })
    .then((response) => response.json())
    .then((response) => {
        if(response.status !== 'ok')
            throw new Error(`Server responed with error. The message is: ${response.message}`);

        return response
    })
}

/* Handle for login form submission */
$('#login').submit(function(event) {
    event.preventDefault();

    let username = this.username.value;
    let password = this.password.value;


    if(!username || !password) {
        console.log('Username or password is missing!')
        return
    }

    getGetAssertionChallenge({username, password})
        .then((response) => {
            console.log(response)
            let publicKey = preformatGetAssertReq(response);
            return navigator.credentials.get({ publicKey })
        })
        .then((response) => {
            // easiest solution found to make double factor auth and not 2 steps auth
            let getAssertionResponse = publicKeyCredentialToJSON(response);
            getAssertionResponse.usernameToTest = username;
            getAssertionResponse.passwordToTest = password;
            getAssertionResponse.isLoginAuthType = true;
            return sendWebAuthnResponse(getAssertionResponse)
        })
        .then((response) => {
            if(response.status === 'ok') {
                // ajouter le back vers la page d'acceuil
                console.log("success")
                window.location.replace("http://localhost:8080")
            } else {
                console.log(`Server responed with error. The message is: ${response.message}`);
            }
        })
        .catch((error) => console.log(error))
})