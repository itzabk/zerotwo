var passwordResetFormEl = document.getElementById("password-reset-form");
var alertEl = document.getElementById("alert");
var passwordEl = document.getElementById("password");
var passwordVerifyEl = document.getElementById("password-verify");

// 2. Reset the user's password
function formResetPassword(e) {
  // Prevent the form's default behavior
  e.preventDefault();
  // Reset the alert to empty
  setAlert();
  // Verify that the passwords match
  var password = passwordEl.value;
  console.log(password);
  var passwordVerify = passwordVerifyEl.value;
  console.log(passwordVerify);
  if (password !== passwordVerify) {
    return setAlert("Password verification must match.");
  }
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  };

  // console.log(document.location.href);
  fetch(document.location.href, requestOptions)
    .then((response) => console.log('done!'))
}

// Set the alert element to show the message
function setAlert(message) {
  alertEl.innerText = message;
  alertEl.style.display = message ? "block" : "none";
}

// 3. Add an event listener for the password reset form submit
passwordResetFormEl.addEventListener("submit", formResetPassword);
