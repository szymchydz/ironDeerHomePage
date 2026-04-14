// =======================================
// MAIN.JS
// ========================================

document.addEventListener("DOMContentLoaded", function() {
  
  // ========================================
  // PRELOADER
  // ========================================
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", function() {
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 1000);
  });

  // ========================================
  // SCROLL PROGRESS BAR
  // ========================================
  const scrollProgress = document.getElementById("scrollProgress");
  
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercent + "%";
  });

  // ========================================
  // COOKIE BANNER
  // ========================================
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("cookie-accept");

  if (!localStorage.getItem("cookieAccepted")) {
    setTimeout(() => {
      cookieBanner.classList.add("show");
    }, 2000);
  }

  acceptButton.addEventListener("click", function() {
    localStorage.setItem("cookieAccepted", "true");
    cookieBanner.classList.remove("show");
  });

  // ========================================
  // HAMBURGER MENU
  // ========================================
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinksItems = document.querySelectorAll(".nav-links a");

  hamburger.addEventListener("click", function() {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  navLinksItems.forEach(item => {
    item.addEventListener("click", function() {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // ========================================
  // NAVBAR VISIBILITY ON SCROLL
  // ========================================
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

  // ========================================
  // SMOOTH SCROLL FOR INTERNAL LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ========================================
  // ANIMATED COUNTER FOR STATS
  // ========================================
  const statNumbers = document.querySelectorAll(".stat-number");
  let counterAnimated = false;

  function animateCounter(element, target) {
    let count = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;

    const counter = setInterval(() => {
      count += increment;
      if (count >= target) {
        element.textContent = target;
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(count);
      }
    }, stepTime);
  }

  function checkStatsInView() {
    if (counterAnimated) return;
    
    const statsSection = document.querySelector(".stats-section");
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top <= windowHeight * 0.75) {
      counterAnimated = true;
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute("data-target"));
        animateCounter(stat, target);
      });
    }
  }

  window.addEventListener("scroll", checkStatsInView);
  checkStatsInView(); // Check on page load

  // ========================================
  // FAQ ACCORDION
  // ========================================
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  });

// ========================================
// CUSTOM LIGHTBOX
// ========================================
initCustomLightbox();

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
  let lastFocused = null;

  const images = Array.from(galleryLinks).map(link => ({
    src: link.href,
    alt: link.querySelector("img")?.alt || ""
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
    if (lastFocused) lastFocused.focus();
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
    link.addEventListener("click", e => {
      e.preventDefault();
      lastFocused = link;
      showImage(index);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener("click", e => {
    e.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener("click", e => {
    e.stopPropagation();
    showNext();
  });

  document.addEventListener("keydown", e => {
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

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightbox.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) showNext();
    if (touchEndX > touchStartX + swipeThreshold) showPrev();
    touchStartX = 0;
    touchEndX = 0;
  }
}


  // ========================================
  // SCROLL TO TOP BUTTON
  // ========================================
  const btnHome = document.getElementById('btnHome');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnHome.classList.add('show');
    } else {
      btnHome.classList.remove('show');
    }
  });

  btnHome.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ========================================
  // PARALLAX BACKGROUND EFFECT (Improved)
  // ========================================
 /* window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    const zoom = Math.min(150 + scroll / 20, 300);
    const posY = Math.max(50 - scroll / 100, 30);
    
    let posX;
    if (scroll < 400) {
      posX = 40 - scroll / 50;
    } else if (scroll < 800) {
      posX = 32 - (scroll - 400) / 100;
    } else {
      posX = 28;
    }

    document.body.style.backgroundSize = `${zoom}%`;
    document.body.style.backgroundPosition = `${posX}% ${posY}%`;
  });*/

  

  // ========================================
  // FORM VALIDATION & SUBMISSION
  // ========================================
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const fileInput = document.getElementById("attachment");
  const fileName = document.getElementById("fileName");

  // File input change handler
  if (fileInput) {
    fileInput.addEventListener("change", function() {
      if (this.files && this.files[0]) {
        fileName.textContent = this.files[0].name;
      } else {
        fileName.textContent = "";
      }
    });
  }

  // Real-time validation
  function validateField(input, errorElement, validator) {
    input.addEventListener("blur", () => {
      const error = validator(input.value.trim());
      if (error) {
        errorElement.textContent = error;
        input.style.borderColor = "#ff3c00";
      } else {
        errorElement.textContent = "";
        input.style.borderColor = "#ff7300";
      }
    });

    input.addEventListener("input", () => {
      if (errorElement.textContent) {
        const error = validator(input.value.trim());
        if (!error) {
          errorElement.textContent = "";
          input.style.borderColor = "";
        }
      }
    });
  }

  // Validators
  const validators = {
    name: (value) => {
      if (!value) return "Imię jest wymagane";
      if (value.length < 2) return "Imię musi mieć minimum 2 znaki";
      return "";
    },
    phone: (value) => {
      if (!value) return "Telefon jest wymagany";
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(value)) return "Nieprawidłowy numer telefonu";
      return "";
    },
    email: (value) => {
      if (!value) return "Email jest wymagany";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Nieprawidłowy adres email";
      return "";
    },
    message: (value) => {
      if (!value) return "Wiadomość jest wymagana";
      if (value.length < 10) return "Wiadomość musi mieć minimum 10 znaków";
      return "";
    }
  };

  if (contactForm) {
    validateField(nameInput, document.getElementById("nameError"), validators.name);
    validateField(phoneInput, document.getElementById("phoneError"), validators.phone);
    validateField(emailInput, document.getElementById("emailError"), validators.email);
    validateField(messageInput, document.getElementById("messageError"), validators.message);

    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();

      // Validate all fields
      const nameError = validators.name(nameInput.value.trim());
      const phoneError = validators.phone(phoneInput.value.trim());
      const emailError = validators.email(emailInput.value.trim());
      const messageError = validators.message(messageInput.value.trim());

      document.getElementById("nameError").textContent = nameError;
      document.getElementById("phoneError").textContent = phoneError;
      document.getElementById("emailError").textContent = emailError;
      document.getElementById("messageError").textContent = messageError;

      if (nameError || phoneError || emailError || messageError) {
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector(".btn-submit");
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      // Submit form
      const formData = new FormData(contactForm);
      
      fetch(contactForm.action, {
        method: "POST",
        body: formData
      })
      .then(response => {
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;

        if (response.ok) {
          showModal("success", "Wiadomość Wysłana!", "Dziękujemy za kontakt. Odpowiemy w ciągu 24 godzin.");
          contactForm.reset();
          fileName.textContent = "";
        } else {
          showModal("error", "Błąd Wysyłania", "Wystąpił problem z wysłaniem wiadomości. Spróbuj ponownie lub skontaktuj się telefonicznie.");
        }
      })
      .catch(error => {
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
        showModal("error", "Błąd Połączenia", "Nie udało się wysłać wiadomości. Sprawdź połączenie internetowe i spróbuj ponownie.");
      });
    });
  }

  // ========================================
  // MODAL FUNCTIONS
  // ========================================
  function showModal(type, title, message) {
    const modal = document.getElementById("messageModal");
    const modalIcon = document.getElementById("modalIcon");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");

    modalIcon.className = `modal-icon ${type}`;
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modal.classList.add("show");

    // Auto close after 5 seconds
    setTimeout(() => {
      modal.classList.remove("show");
    }, 5000);
  }

  // Modal close button
  const modalClose = document.getElementById("modalClose");
  const messageModal = document.getElementById("messageModal");

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      messageModal.classList.remove("show");
    });
  }

  if (messageModal) {
    messageModal.addEventListener("click", (e) => {
      if (e.target === messageModal) {
        messageModal.classList.remove("show");
      }
    });
  }

  // Check URL parameters for success/error messages
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("success") === "true") {
    showModal("success", "Wiadomość Wysłana!", "Dziękujemy za kontakt. Odpowiemy w ciągu 24 godzin.");
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (urlParams.get("error") === "true") {
    showModal("error", "Błąd Wysyłania", "Wystąpił problem z wysłaniem wiadomości. Spróbuj ponownie.");
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // ========================================
  // ANIMATE ON SCROLL (AOS) Implementation
  // ========================================
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate");
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-aos attribute
  document.querySelectorAll("[data-aos]").forEach(element => {
    observer.observe(element);
  });

  // ========================================
  // BUTTON RIPPLE EFFECT
  // ========================================
  document.querySelectorAll(".btn-primary, .btn-zarezerwuj, .btn-pricing").forEach(button => {
    button.addEventListener("click", function(e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // ========================================
  // LAZY LOADING FOR IMAGES
  // ========================================
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ========================================
  // PERFORMANCE: Debounce scroll events
  // ========================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  console.log("🏍️ Iron Deer - Website Loaded Successfully!");
});

// ========================================
// END OF MAIN.JS
// ========================================
