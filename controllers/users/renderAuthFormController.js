module.exports.renderAuth = (req, res) => {
    res.render('auth', {
        title: 'Необходимо авторизоваться.'
    });
}