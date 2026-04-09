const books = [
  { id: 1, title: "Toxic Parenting", price: 199, img: "../images/bbok 6.png" },
  { id: 2, title: "A Journey Through Life's Lesson", price: 165, img: "../images/book 5.png" },
  { id: 3, title: "The Shattering", price: 210, img: "../images/BOKKKKK.png" },
  { id: 4, title: "Shattered Sonnets", price: 175, img: "../images/WhatsApp Image 2025-06-16 at 12.12.25_68afe91a.png" },
  { id: 5, title: "A Beautiful Moment", price: 155, img: "../images/book 5 (1).png" },
  { id: 6, title: "Light House Research Articles", price: 140, img: "../images/Rectangle 101.png" }
];

let search = "";
let start = 0;
let trendStart = 0;

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", (e) => {
  search = e.target.value.toLowerCase();
  trendStart = 0;
  render();
});

function render() {
  const isSearching = search.trim().length > 0;

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search)
  );

  document.getElementById("trendTitle").innerText =
    isSearching ? "We Found" : "Trending Now";

  document.getElementById("noResults").style.display =
    isSearching && filtered.length === 0 ? "block" : "none";

  // Hide sections when searching
  document.getElementById("marqueeSection").style.display =
    isSearching ? "none" : "block";

  document.getElementById("previewSection").style.display =
    isSearching ? "none" : "block";

  renderMarquee();
  renderPreview();
  renderTrending(isSearching ? filtered : books.slice(trendStart, trendStart + 5));
}

function renderMarquee() {
  const track = document.getElementById("marqueeTrack");
  track.innerHTML = "";

  [...books, ...books].forEach(book => {
    track.innerHTML += `
      <div class="marquee-card">
        <img src="${book.img}">
        <p>${book.title}</p>
      </div>
    `;
  });
}

function renderPreview() {
  const row = document.getElementById("flipRow");
  row.innerHTML = "";

  books.slice(start, start + 5).forEach(book => {
    row.innerHTML += `
      <div class="flip-card">
        <div class="flip-inner">
          <div class="flip-front">
            <img src="${book.img}">
            <h3>${book.title}</h3>
          </div>
          <div class="flip-back">
            <h3>${book.title}</h3>
            <p class="price">₹${book.price}</p>
            <button class="buy-btn">Buy Now</button>
          </div>
        </div>
      </div>
    `;
  });
}

function renderTrending(list) {
  const row = document.getElementById("trendRow");
  row.innerHTML = "";

  list.forEach(book => {
    row.innerHTML += `
      <div class="book-card">
        <div class="book-img">
          <img src="${book.img}">
        </div>
        <div class="book-info">
          <h3>${book.title}</h3>
        </div>
      </div>
    `;
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".section-block").forEach(el => {
  observer.observe(el);
});

// Navigation
document.getElementById("prevBtn").onclick = () => {
  start = Math.max(start - 5, 0);
  render();
};

document.getElementById("nextBtn").onclick = () => {
  start = Math.min(start + 5, books.length - 5);
  render();
};

document.getElementById("trendPrev").onclick = () => {
  trendStart = Math.max(trendStart - 5, 0);
  render();
};

document.getElementById("trendNext").onclick = () => {
  trendStart = Math.min(trendStart + 5, books.length - 5);
  render();
};

// Initial render
render();

// Mobile Menu Functionality (from landing page)
function toggleMobileMenu() {
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  mobileNavOverlay.classList.toggle("active");
  mobileMenuBtn.classList.toggle("active");

  if (mobileNavOverlay.classList.contains("active")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

function closeMobileMenu() {
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  mobileNavOverlay.classList.remove("active");
  mobileMenuBtn.classList.remove("active");
  document.body.style.overflow = "";
}

// Language Dropdown Functionality
const languageToggle = document.getElementById("languageToggle");
const languageMenu = document.getElementById("languageMenu");
const seeAllLang = document.getElementById("seeAllLang");
const moreLanguages = document.getElementById("moreLanguages");

if (languageToggle) {
  languageToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    languageMenu.style.display = languageMenu.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", () => {
    languageMenu.style.display = "none";
  });
}

if (seeAllLang) {
  seeAllLang.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    moreLanguages.style.display = moreLanguages.style.display === "none" ? "flex" : "none";
  });
}