$(function () {
  const $username = $("#username");
  const $email = $("#email");
  const $password = $("#password");
  const $confirmPassword = $("#confirmPassword");
  const $gender = $("#gender");

  const $topicsError = $("#topicsError");
  const $genderError = $("#genderError");

  function setInputError($input, $errorEl, show) {
    if (show) {
      $input.addClass("input-error");
      $errorEl.removeClass("d-none");
    } else {
      $input.removeClass("input-error");
      $errorEl.addClass("d-none");
    }
  }

  function isEmpty(val) {
    return !val || val.trim() === "";
  }

  function validateEmptyField($input, $errorEl) {
    const empty = isEmpty($input.val());
    setInputError($input, $errorEl, empty);
    return !empty;
  }

  function validateTopics() {
    const anyChecked = $(".topic:checked").length > 0;
    if (!anyChecked) $topicsError.removeClass("d-none");
    else $topicsError.addClass("d-none");
    return anyChecked;
  }

  function validateGender() {
    const ok = $gender.val() !== "--";
    if (!ok) $genderError.removeClass("d-none");
    else $genderError.addClass("d-none");
    return ok;
  }

  function validateConfirmPasswordMatch() {
    // Only check mismatch when clicking submit (per requirement).
    const pass = $password.val();
    const confirm = $confirmPassword.val();

    const mismatch = !isEmpty(confirm) && pass !== confirm;

    if (mismatch) {
      $confirmPassword.addClass("input-error");
      $("#confirmPasswordMismatchError").removeClass("d-none");
    } else {
      $("#confirmPasswordMismatchError").addClass("d-none");
      // don't remove red border here if it's red because empty check; we'll handle that separately
      if (!isEmpty(confirm)) $confirmPassword.removeClass("input-error");
    }
    return !mismatch;
  }

  // Optional: live validation for empties + topics + gender (nice UX, not required but allowed)
  $username.on("input blur", () => validateEmptyField($username, $("#usernameError")));
  $email.on("input blur", () => validateEmptyField($email, $("#emailError")));
  $password.on("input blur", () => validateEmptyField($password, $("#passwordError")));
  $confirmPassword.on("input blur", () => validateEmptyField($confirmPassword, $("#confirmPasswordEmptyError")));

  $(".topic").on("change", validateTopics);
  $gender.on("change", validateGender);

  $("#submitBtn").on("click", function () {
    // 1) empty checks (username/email/password/confirm)
    const okUsername = validateEmptyField($username, $("#usernameError"));
    const okEmail = validateEmptyField($email, $("#emailError"));
    const okPassword = validateEmptyField($password, $("#passwordError"));
    const okConfirmEmpty = validateEmptyField($confirmPassword, $("#confirmPasswordEmptyError"));

    // If confirm is empty, mismatch message must NOT appear.
    if (!okConfirmEmpty) {
      $("#confirmPasswordMismatchError").addClass("d-none");
    }

    // 2) topics + gender checks
    const okTopics = validateTopics();
    const okGender = validateGender();

    // 3) mismatch check (only on submit)
    const okConfirmMatch = okConfirmEmpty ? validateConfirmPasswordMatch() : false;

    const allOk = okUsername && okEmail && okPassword && okConfirmEmpty && okTopics && okGender && okConfirmMatch;

    if (allOk) {
      alert("Form submitted successfully ✅");
      // You can reset here if you want:
      // $("input").val(""); $(".topic").prop("checked", false); $gender.val("--");
    }
  });
});
