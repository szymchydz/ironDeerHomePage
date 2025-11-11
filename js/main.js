document.addEventListener("DOMContentLoaded", function() {
  // Coockie banner
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("cookie-accept");

  if (!localStorage.getItem("cookieAccepted")) {
    cookieBanner.classList.add("show");
  }

  acceptButton.addEventListener("click", function() {
    localStorage.setItem("cookieAccepted", "true");
    cookieBanner.classList.remove("show");
  });

  // Hamburger menu
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinksItems = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", function() {
    navLinks.classList.toggle("active");
  });

  navLinksItems.forEach(item => {
    item.addEventListener("click", function() {
      navLinks.classList.remove("active");
    });
  });

  // Navbar visibility on scroll
  const navbar = document.querySelector(".navbar");
  const SHOW_THRESHOLD = 5;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop <= SHOW_THRESHOLD) {
      navbar.classList.remove("navbar-hidden");
    } else {
      navbar.classList.add("navbar-hidden");
    }
  });

  // Smooth scroll for scroll-down button
  const scrollDown = document.querySelector(".scroll-down");
  if (scrollDown) {
    scrollDown.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Lightbox functionality
  initCustomLightbox();

  // Form validation
  const contactForm = document.querySelector("#formularz form");
  if (contactForm) {
    // Form submission feedback
    const urlParams = new URLSearchParams(window.location.search);
    const formFeedback = document.createElement('div');
    formFeedback.className = 'form-feedback';
    const form = document.querySelector('.contact-form');

    if (urlParams.has('success')) {
      formFeedback.textContent = 'Wiadomość została wysłana pomyślnie!';
      formFeedback.classList.add('success');
      form.parentNode.insertBefore(formFeedback, form);
    } else if (urlParams.has('error')) {
      const errorType = urlParams.get('error');
      if (errorType === 'invalid_email') {
        formFeedback.textContent = 'Wystąpił błąd: nieprawidłowy format e-mail.';
      } else {
        formFeedback.textContent = 'Wystąpił błąd podczas wysyłania wiadomości.';
      }
      formFeedback.classList.add('error');
      form.parentNode.insertBefore(formFeedback, form);
    }
    contactForm.addEventListener("submit", (e) => {
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      if (!name || !phone || !email || !message) {
        e.preventDefault();
        alert("Proszę wypełnić wszystkie pola formularza.");
        return !1;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        e.preventDefault();
        alert("Proszę podać prawidłowy adres email.");
        return !1;
      }
    });
  }
});

function initCustomLightbox() {
  const galleryLinks = document.querySelectorAll(".gallery a[data-lightbox]");
  if (galleryLinks.length === 0) return;
  const lightbox = document.createElement("div");
  lightbox.className = "custom-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Podgląd zdjęcia");
  lightbox.setAttribute("tabindex", "-1");
  const lightboxContent = document.createElement("div");
  lightboxContent.className = "lightbox-content";
  const img = document.createElement("img");
  img.alt = "Podgląd zdjęcia w pełnym rozmiarze";
  const closeBtn = document.createElement("button");
  closeBtn.className = "lightbox-close";
  closeBtn.innerHTML = "×";
  closeBtn.setAttribute("aria-label", "Zamknij podgląd");
  const prevBtn = document.createElement("button");
  prevBtn.className = "lightbox-nav lightbox-prev";
  prevBtn.innerHTML = "‹";
  prevBtn.setAttribute("aria-label", "Poprzednie zdjęcie");
  const nextBtn = document.createElement("button");
  nextBtn.className = "lightbox-nav lightbox-next";
  nextBtn.innerHTML = "›";
  nextBtn.setAttribute("aria-label", "Następne zdjęcie");
  lightboxContent.appendChild(img);
  lightbox.appendChild(lightboxContent);
  lightbox.appendChild(closeBtn);
  lightbox.appendChild(prevBtn);
  lightbox.appendChild(nextBtn);
  document.body.appendChild(lightbox);
  let currentIndex = 0;
  const images = Array.from(galleryLinks).map((link) => ({
    src: link.href,
    alt: link.querySelector("img")?.alt || "",
  }));
  function showImage(index) {
    currentIndex = index;
    img.src = images[index].src;
    img.alt = images[index].alt;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }
  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }
  galleryLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showImage(index);
    });
  });
  closeBtn.addEventListener("click", closeLightbox);
  closeBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter") closeLightbox();
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("show")) return;
    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        showPrev();
        break;
      case "ArrowRight":
        showNext();
        break;
    }
  });
  let touchStartX = 0;
  let touchEndX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) showNext();
    if (touchEndX > touchStartX + swipeThreshold) showPrev();
  }
}
