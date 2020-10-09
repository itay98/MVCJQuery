var myRole = 0, code = "", handler;
function changeMyRole(role) {
    myRole = role;
}
function clearCode() {
    code = "";
}
function codeConcat(digit, codeReset) {
    clearTimeout(handler);
    code += digit;
    if (code.length == 4)
        return true;
    if (code.length < 4)
        handler = setTimeout(codeReset, 3000);
    return false;
}
function validatePasscode(passcode) {
    if (passcode.length != 4)
        return false;
    else
        return $.ajax({
            url: "https://finalproject-36f3f1.appdrag.site/api/auth/searchPasscode",
            data: { passcode: passcode }, method: "POST"
        });
}
function validateUsername(username) {
    if (username.length < 6 || username.length > 12)
        return false;
    else
        return $.ajax({
            url: "https://finalproject-36f3f1.appdrag.site/api/auth/searchUsername",
            data: { username: username }, method: "GET"
        });
}
function callAjax(settings, callback, value = null) {
    $.ajax(settings)
        .done(result => {
            callback(result, settings.data, value);
        })
        .catch(err => {
            console.log(err);
        });
}

export { validatePasscode, validateUsername, codeConcat, clearCode, myRole, code, changeMyRole, callAjax };