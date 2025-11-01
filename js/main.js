document.addEventListener("DOMContentLoaded", function() {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("cookie-accept");

  if (!localStorage.getItem("cookieAccepted")) {
    cookieBanner.style.display = "block";
  }

  acceptButton.addEventListener("click", function() {
    localStorage.setItem("cookieAccepted", "true");
    cookieBanner.style.display = "none";
  });
});
