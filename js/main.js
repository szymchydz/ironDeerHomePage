document.addEventListener("DOMContentLoaded", function() {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("cookie-accept");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinksItems = document.querySelectorAll(".nav-link");

  if (!localStorage.getItem("cookieAccepted")) {
    cookieBanner.style.display = "block";
  }

  acceptButton.addEventListener("click", function() {
    localStorage.setItem("cookieAccepted", "true");
    cookieBanner.style.display = "none";
  });

  hamburger.addEventListener("click", function() {
    navLinks.classList.toggle("active");
  });

  navLinksItems.forEach(item => {
    item.addEventListener("click", function() {
      navLinks.classList.remove("active");
    });
  });
});
