function login() {

const employee_id =
document.getElementById("id")
.value
.trim();

const password =
document.getElementById("pass")
.value;

if (!employee_id || !password) {

```
alert(
  "Please enter Employee ID and Password"
);

return;
```

}

fetch('/api/login', {

```
method: 'POST',

headers: {
  'Content-Type': 'application/json'
},

body: JSON.stringify({
  employee_id,
  password
})
```

})
.then(res => res.json())
.then(data => {

```
console.log(
  "LOGIN RESPONSE:",
  data
);

if (!data.success) {

  alert(
    data.error ||
    "Invalid login"
  );

  return;
}

// =====================
// SAVE SESSION
// =====================

localStorage.setItem(
  "employee_id",
  data.employee_id
);

localStorage.setItem(
  "name",
  data.name || ""
);

localStorage.setItem(
  "role",
  data.role
);

// =====================
// REDIRECT
// =====================

if (data.role === "ADMIN") {

  window.location.href =
    "/admin/dashboard.html";

  return;
}

if (data.role === "SUPERADMIN") {

  window.location.href =
    "/superadmin/dashboard.html";

  return;
}

// EMPLOYEE

window.location.href =
  "/employee/assessment.html";
```

})
.catch(err => {

```
console.error(
  "LOGIN ERROR:",
  err
);

alert(
  "Unable to login. Please try again."
);
```

});
}

// =====================
// ENTER KEY SUPPORT
// =====================

document.addEventListener(
"keydown",
function (e) {

```
if (e.key === "Enter") {
  login();
}
```

}
);
