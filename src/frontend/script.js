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
                localStorage.setItem('role', response.role);
                localStorage.setItem('permissions', JSON.stringify(response.permissions));
                
                // Afficher la zone protégée
                showProtectedArea(response.login, response.role, response.permissions);
                
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
        localStorage.removeItem('role');
        localStorage.removeItem('permissions');
        
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
        const role = localStorage.getItem('role');
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

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
                    showProtectedArea(username, role, permissions);
                } else {
                    showLoginForm();
                }
            },
            error: function() {
                // Token invalide ou expiré
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                localStorage.removeItem('permissions');
                showLoginForm();
            }
        });
    }

    // Afficher la zone protégée
    function showProtectedArea(username, role, permissions) {
        $('#username').text(username);
        $('#userRole').text(role);
        
        // Afficher les permissions
        $('#userPermissions').empty();
        permissions.forEach(function(perm) {
            $('#userPermissions').append('<li>' + perm + '</li>');
        });
        
        $('#loginForm').addClass('hidden');
        $('#protectedArea').removeClass('hidden');
    }

    // Afficher le formulaire de connexion
    function showLoginForm() {
        $('#protectedArea').addClass('hidden');
        $('#loginForm').removeClass('hidden');
    }
});
