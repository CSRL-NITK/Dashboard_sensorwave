function resetCheck() {
    return function (req, res, next) {
        const needsReset = req.auth?.payload?.['https://sensor-wave-app.com/needsResetPassword'];
        console.log(needsReset);
        if (!needsReset) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        next();
    };
}

module.exports = resetCheck;
