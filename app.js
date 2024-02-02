// id do botao loginButton"
document.getElementById('loginButton').addEventListener('click', function() {
    var loginValue = document.getElementById('login').value.trim();
    var passwordValue = document.getElementById('password').value.trim();
    if (loginValue === '' || passwordValue === '') {
        document.getElementById('warningMessage').innerText = 'Fill in your username and password';
    } else {
        // limpa mendagem de erro
        document.getElementById('warningMessage').innerText = '';
        var user = document.getElementById("login").value;
            sessionStorage.setItem("login", user);
        // Redirecciona para a página home
        window.location.href = 'home.html';
    }
});

