// id do botao loginButton"
document.getElementById('loginButton').addEventListener('click', function() {
    var loginValue = document.getElementById('login').value;
    var passwordValue = document.getElementById('password').value;

    if (loginValue === '' || passwordValue === '') {
        document.getElementById('warningMessage').innerText = 'Por favor preencha ambos os campos.';
    } else {
        // limpa mendagem de erro
        document.getElementById('warningMessage').innerText = '';
        
        // Redirecciona para a página home
        window.location.href = 'home.html';
    }
});
