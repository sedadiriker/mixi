export const updateArrowPosition = (selectedEngine,showSettings) => {
  const searchArrow = document.querySelector(".search-arrow");
  const form = document.querySelector(".gsc-search-box");

const form_global = document.getElementById("global-form")
const form_flux = document.getElementById("flux-form")
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
    }else if(selectedEngine === "mixi-flux"){
      if(form_global){
        form_global.classList.add("hidden");
  
      }
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
    }else if(selectedEngine === "mixi-doctor"){
      if(form_global){
        form_global.classList.add("hidden");
      }
      if(form_flux){
        form_global.classList.add("hidden");
      }
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

      if (form_global) {
        form_global.classList.remove("hidden");
      }
      if (form_flux) {
        form_flux.classList.remove("hidden");
      }
      if (showSettings) {
        if (width < 768) { 
          searchArrow.style.top = "35%"; 
          searchArrow.style.right = "20%"; 
        } else if (width >= 768 && width < 1500) { 
          searchArrow.style.top = "44%"; 
          searchArrow.style.right = "28%";
        } else { 
          searchArrow.style.top = "43.5%"; 
          searchArrow.style.right = "27%"; 
        }
      } else {
        if (width < 768) { 
          searchArrow.style.top = "35%"; 
          searchArrow.style.right = "20%"; 
        } else if (width >= 768 && width < 1500) { 
          searchArrow.style.top = "44%"; 
          searchArrow.style.right = "28%";
        } else { 
          searchArrow.style.top = "43.5%"; 
          searchArrow.style.right = "27%"; 
        }
      }
    }
  }
};


