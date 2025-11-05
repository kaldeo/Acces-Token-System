$(document).ready(function() {
    checkAuth();

    // Gérer la connexion
    $('#btnLogin').click(function() {
        const login = $('#login').val().trim();
        const password = $('#password').val().trim();

        if (!login || !password) {
            $('#errorMsg').text('Veuillez remplir tous les champs');
            return;
        }

        $.ajax({
            url: '/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ login, pass: password }),
            success: function(response) {
                // Stocker le token dans localStorage
                localStorage.setItem('token', response.token);
                localStorage.setItem('username', response.login);
                
                // Afficher la zone protégée
                showProtectedArea(response.login);
                
                // Vider les champs
                $('#login').val('');
                $('#password').val('');
                $('#errorMsg').text('');
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.error : 'Erreur de connexion';
                $('#errorMsg').text(error);
            }
        });
    });

    // Gérer la déconnexion
    $('#btnLogout').click(function() {
        // Supprimer le token du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        
        // Masquer la zone protégée et afficher le formulaire
        showLoginForm();
    });

    // Permettre de se connecter avec la touche Entrée
    $('#login, #password').keypress(function(e) {
        if (e.which === 13) { // Touche Entrée
            $('#btnLogin').click();
        }
    });

    function checkAuth() {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (!token) {
            showLoginForm();
            return;
        }

        // Vérifier que le token est toujours valide
        $.ajax({
            url: '/api/verify',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function(response) {
                if (response.valid) {
                    showProtectedArea(username);
                } else {
                    showLoginForm();
                }
            },
            error: function() {
                // Token invalide ou expiré
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                showLoginForm();
            }
        });
    }

    // Afficher la zone protégée
    function showProtectedArea(username) {
        $('#username').text(username);
        $('#loginForm').addClass('hidden');
        $('#protectedArea').removeClass('hidden');
    }

    // Afficher le formulaire de connexion
    function showLoginForm() {
        $('#protectedArea').addClass('hidden');
        $('#loginForm').removeClass('hidden');
    }
});
