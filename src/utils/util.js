export const updateArrowPosition = (selectedEngine,showSettings) => {
  const searchArrow = document.querySelector(".search-arrow");
  const form = document.querySelector(".gsc-search-box");

  if (searchArrow) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (selectedEngine === "global-search") {
      if (form) {
        form.classList.add("hidden");
      }
      if (width < 768) { 
        searchArrow.style.top = "10%"; 
        searchArrow.style.right = "5%"; 
      } else if (width >= 768 && width < 1500) {
        searchArrow.style.top = "20%"; 
        searchArrow.style.right = "5%"; 
      } else { 
        searchArrow.style.top = "8%"; 
        searchArrow.style.right = "4%"; 
      }
    } else {
      if (form) {
        form.classList.remove("hidden");
      }
      if (showSettings) {
        if (width < 768) { 
          searchArrow.style.top = "35%"; 
          searchArrow.style.right = "20%"; 
        } else if (width >= 768 && width < 1500) { 
          searchArrow.style.top = "41.5%"; 
          searchArrow.style.right = "28%";
        } else { 
          searchArrow.style.top = "42%"; 
          searchArrow.style.right = "27%"; 
        }
      } else {
        if (width < 768) { 
          searchArrow.style.top = "35%"; 
          searchArrow.style.right = "20%"; 
        } else if (width >= 768 && width < 1500) { 
          searchArrow.style.top = "41.5%"; 
          searchArrow.style.right = "28%";
        } else { 
          searchArrow.style.top = "42%"; 
          searchArrow.style.right = "27%"; 
        }
      }
    }
  }
};


