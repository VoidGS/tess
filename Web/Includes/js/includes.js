$('#themeLight').on('click', function() {
    $('#themeLink').attr("href", "/assets/css/style.bundle.css");

    $('#themeLight').addClass('active');
    $('#themeDark').removeClass('active');

    $('#menuThemeIconLight').removeClass('d-none');
    $('#menuThemeIconDark').addClass('d-none');
});

$('#themeDark').on('click', function() {
    $('#themeLink').attr("href", "/assets/css/style.dark.bundle.css");

    $('#themeLight').removeClass('active');
    $('#themeDark').addClass('active');

    $('#menuThemeIconLight').addClass('d-none');
    $('#menuThemeIconDark').removeClass('d-none');
});