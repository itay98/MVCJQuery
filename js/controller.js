import * as View from "./view.js";
import * as Model from "./model.js";
export function init() {
    document.getElementById("enterPasscode").addEventListener("click", enterPasscode);
    for (let i = 0; i < 10; i++)
        document.getElementById(i).onclick = () => { codeInput(i) };
}
function enterPasscode() {
    document.onkeypress = e => {
        if (!isNaN(parseInt(e.key)))
            codeInput(e.key);
    };
    View.digitsSlide();
}
function addUser() {
    var username = document.getElementById("addUsername").value;
    var valid = Model.validateUsername(username);
    if (valid)
        valid.done(result => {
            if (result.Table.length == 1)
                View.myAlert("this username already exists");
            else {
                var fName = document.getElementById("addFName").value, role = 3;
                if (Model.myRole == 1)
                    role = document.getElementById("addRole").value;
                Model.callAjax({
                    url: "https://finalproject-36f3f1.appdrag.site/api/addUser",
                    data: { username: username, fName: fName, role: role }, method: "POST"
                }, View.postAdd, Model.myRole);
            }
        });
    else
        View.myAlert("a valid username must be 6-12 characters");
}
function deleteUser() {
    if (confirm("delete user?"))
        Model.callAjax({
            url: "https://finalproject-36f3f1.appdrag.site/api/deleteUser",
            data: { username: this.id.slice(3) }, method: "DELETE"
        }, View.postDelete);
}
function updatePass() {
    var passcode = document.getElementById("passcode").value;
    var id = document.getElementById("selfEdit").querySelector("button").id;
    var valid = Model.validatePasscode(passcode);
    if (valid)
        valid.done(result => {
            if (result.Table.length == 1)
                View.myAlert("this passcode already exists");
            else
                Model.callAjax({
                    url: "https://finalproject-36f3f1.appdrag.site/api/changePass",
                    data: { username: id.slice(3), passcode: passcode }, method: "POST"
                }, View.postUpdatePass);
        });
    else
        View.myAlert("a valid passcode must be 4 digits");
}
function updateUser(n, o) {
    var role = Model.myRole;
    var fName = document.getElementById("fName" + o).value;
    if (role == 1) {
        var input = document.getElementById("role" + o);
        if (input != undefined)
            role = input.value;
    }
    Model.callAjax({
        url: "https://finalproject-36f3f1.appdrag.site/api/updateUser",
        data: { newUsername: n, username: o, fName: fName, role: role }, method: "POST"
    }, View.postUpdate);
}
function callUpdateUser() {
    var u = this.id.slice(3);
    var newU = document.getElementById("username" + u).value;
    if (newU != u) {
        var valid = Model.validateUsername(newU);
        if (valid)
            valid.done(result => {
                if (result.Table.length == 1)
                    View.myAlert("this username already exists");
                else
                    updateUser(newU, u);
            });
        else
            View.myAlert("a valid username must be 6-12 characters");
    }
    else
        updateUser(u, u);
}
function codeReset() {
    View.codeTimeOut();
    View.clearClassnames(Model.code);
    Model.clearCode();
}
function codeInput(digit) {
    View.selectedDigit(digit);
    if (Model.codeConcat(digit, codeReset))
        login();
}
function login() {
    Model.callAjax({
        url: "https://finalproject-36f3f1.appdrag.site/api/auth/login",
        data: {
            username: document.getElementById("username").value,
            passcode: Model.code
        }, method: "POST"
    }, postLogin);
}

function postLogin(result) {
    View.clearClassnames(Model.code);
    Model.clearCode();
    if (result.Table.length == 1)
        loginSuccess(result.Table[0]);
    else
        View.loginFail();
}
function loginSuccess(user) {
    Model.changeMyRole(user.role);
    document.getElementById("update").addEventListener("click", callUpdateUser);
    View.reachDashboard(user);
    document.getElementById("addUser").addEventListener("click", addUser);
    document.getElementById("updatePass").addEventListener("click", updatePass);
    Model.callAjax({
        url: "https://finalproject-36f3f1.appdrag.site/api/admin/getUsers",
        data: { role: Model.myRole }, method: "GET"
    }, View.createUsersTable);
}
export { callUpdateUser, deleteUser };