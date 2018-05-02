let checkIfLoggedIn = () => {
    return fetch('/isLoggedIn', { credentials: 'include' })
        .then((response) => response.json())
        .then((response) => {
            if (response.status === 'ok') {
                return true
            } else {
                return false
            }
        })
}

function checkAndRedirect() {

    if (checkIfLoggedIn() === true) {
        onBuyClicked()
    } else {
        window.location.replace('http://localhost:3000/pages/authentication.html');
    }
}