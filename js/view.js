import * as Controller from "./controller.js";
var selfDiv = document.getElementById("selfEdit"), strike = 0;
var digitsDiv = $("#digits"), dashboardDiv = $("#dashboard"), loginDiv = $("#login");
var sounds = loginDiv[0].querySelectorAll("audio");
function myAlert(message) {
    alert(message);
}
function createUsersTable(result, data) {
    if (result.Table.length > 0) {
        var table = document.querySelector("table"), append = "", myRole = data.role;
        if (myRole == 1)
            append = "<th>role</th><th>&#9998;</th>"
        table.innerHTML = "<tr><th>x</th><th>username</th><th>first name</th>" + append + "</tr>";
        result.Table.forEach((user) => { createUserRow(user, table, myRole) });
        table.querySelectorAll("button[id ^= del]").forEach(btn => { btn.addEventListener("click", Controller.deleteUser) });
        if (myRole == 1)
            table.querySelectorAll("button[id ^= upd]").forEach(btn => { btn.addEventListener("click", Controller.callUpdateUser)});
    }
    else
        alert("no users found");
}
function createUserRow(user, table, myRole) {
    var append = "readonly></td>", u = user.username;
    if (myRole == 1)
        append = `></td><td><input id="role${u}" type="number" value="${user.role}"></td>
        <td><button id="upd${u}">update</button></td>`;
    table.innerHTML += `<tr id="row${u}"><td><button id="del${u}">x</button></td>
    <td><input id="username${u}" type="text" value="${u}"></td>
    <td><input id="fName${u}" type="text" value="${user.fName}" ${append}</tr>`;
}
function postDelete(result, data) {
    if (result.affectedRows == 1)
        document.getElementById("row" + data.username).remove();
    else
        alert("error");
}
function postUpdate(result, data) {
    if (result.affectedRows == 1) {
        if (data.username != data.newUsername)
            updateUsername(data.username, data.newUsername);
        alert("info changed");
    }
    else
        alert("error");
}
function postUpdatePass(result) {
    if (result.affectedRows == 1){
        document.getElementById("passcode").value = "";
        alert("passcode changed");
    }
    else
        alert("error");
}
function reachDashboard(user) {
    document.onkeypress = null;
    sounds.item(3).play();
    digitsDiv.slideUp("normal");
    loginDiv.hide("slow")
    dashboardDiv.fadeIn("slow");
    document.getElementById("logout").addEventListener("click", logout);
    setSelfEdit(user);
}
function setSelfEdit(user) {
    var fields = selfDiv.querySelectorAll("input"), u = user.username;
    var roles = ["Administrator", "Manager", "Salesman"];
    selfDiv.querySelector("span").innerText = roles[user.role - 1];
    selfDiv.querySelector("button").id = "upd" + u;
    fields[0].value = u;
    fields[1].value = user.fName;
    fields[0].id = "username" + u;
    fields[1].id = "fName" + u;
    setEditUsers(document.getElementById("addRole"), user.role);
}
function setEditUsers(addRole, myRole) {
    if (myRole < 3) {
        document.getElementById("editUsers").style.display = "block";
        if (myRole == 1)
            addRole.readOnly = false;
        else {
            addRole.value = 3;
            addRole.readOnly = true;
        }
    }
    else
        document.getElementById("editUsers").style.display = "none";
}
function loginFail() {
    strike++;
    if (strike == 3) {
        sounds.item(4).play();
        alert("police is comming");
        loginDiv.slideUp("slow");
    }
    else {
        sounds.item(2).play();
        alert("wrong credentials");
    }
}
function logout() {
    dashboardDiv.fadeOut("fast");
    loginDiv.show("slow");
    document.querySelector("table").innerHTML = "";
    strike = 0;
}
function updateUsername(o, n) {
    document.getElementById("upd" + o).id = "upd" + n;
    document.getElementById("fName" + o).id = "fName" + n;
    document.getElementById("username" + o).id = "username" + n;
    var del = document.getElementById("del" + o);
    if (del != undefined) {
        del.id = "del" + n;
        document.getElementById("role" + o).id = "role" + n;
        document.getElementById("row" + o).id = "row" + n;
    }
}
function postAdd(result, data, myRole) {
    if (result.affectedRows == 1) {
        var role = document.getElementById("addRole");
        document.getElementById("addUsername").value = "";
        document.getElementById("addFName").value = "";
        if (myRole == 2)
            role.value = 3;
        else
            role.value = "";
        createUserRow(data, document.querySelector("table"), myRole);
    }
    else
        alert("error");
}
function clearClassnames(code) {
    for (const digit of code) {
        document.getElementById(digit).className = "";
    }
}
function selectedDigit(digit) {
    sounds.item(0).play();
    var selected = document.getElementById(digit);
    selected.className = "selected";
    $(selected).animate({ fontSize: '40px' }, "fast").animate({ fontSize: '50px' }, "normal");
}
function digitsSlide() {
    sounds.item(0).play();
    digitsDiv.slideDown("slow");
}
function codeTimeOut() {
    sounds.item(1).play();
}
export { codeTimeOut, digitsSlide, postUpdate, postAdd, postDelete, postUpdatePass, reachDashboard,
    loginFail, createUserRow, createUsersTable, selectedDigit, clearClassnames, myAlert };