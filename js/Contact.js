let nameInput = $("#name");
let emailInput = $("#email");
let phoneInput = $("#phone");
let ageInput = $("#age");
let passwordInput = $("#password");
let repasswordInput = $("#repassword");

$("#submit-btn").prop("disabled", true);

$("input").on("input", function () {
  if (
    validateName() &&
    validateEmail() &&
    validatePhone() &&
    validateAge() &&
    validatePassword() &&
    passwordInput.val() === repasswordInput.val()
  ) {
    $("#submit-btn").prop("disabled", false);
  } else {
    $("#submit-btn").prop("disabled", true);
  }
});

function validateName() {
  let nameRegex = /.{3,}/;
  return nameRegex.test(nameInput.val());
}

function validateEmail() {
  let emailRegex = /\w+@\w+\.[^\s@]{2,8}/;
  return emailRegex.test(emailInput.val());
}

function validatePhone() {
  let phoneRegex = /^\d{11}$/;
  return phoneRegex.test(phoneInput.val());
}

function validateAge() {
  let ageRegex = /^\d+/;
  return ageRegex.test(ageInput.val());
}

function validatePassword() {
  let passwordRegex = /.{6,}/;
  return passwordRegex.test(passwordInput.val());
}
