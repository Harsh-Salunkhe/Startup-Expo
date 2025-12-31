//Programming fpr navBar disappear on scroll down

// ========================================
// F1 LOADING SCREEN LOGIC
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('f1-loading-screen');
    const lights = document.querySelectorAll('.f1-light');
    
    // Function to light up each red light sequentially
    function lightUpRed() {
        let delay = 0;
        lights.forEach((light, index) => {
            setTimeout(() => {
                light.classList.add('red');
            }, delay);
            delay += 400; // 400ms between each light
        });
        
        // After all lights are red, turn them all green
        setTimeout(() => {
            lights.forEach(light => {
                light.classList.remove('red');
                light.classList.add('green');
            });
            
            // Hide loading screen after green lights
            setTimeout(() => {
                loadingScreen.classList.add('loaded');
                document.body.style.overflow = ''; // Re-enable scrolling
            }, 800);
        }, delay + 600); // Wait for all reds + extra pause
    }
    
    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';
    
    // Check if page is fully loaded
    if (document.readyState === 'complete') {
        // If already loaded, start immediately
        setTimeout(lightUpRed, 500);
    } else {
        // Otherwise wait for load event
        window.addEventListener('load', function() {
            setTimeout(lightUpRed, 500);
        });
    }
    
    // Fallback: Force hide after 5 seconds regardless
    setTimeout(() => {
        loadingScreen.classList.add('loaded');
        document.body.style.overflow = '';
    }, 5000);
});

let lastPosn = 0;
console.log("app");
const NavEffect = (evt) => {
    if (window.scrollY > lastPosn){
        navBar.style.transform = "translateY(-100%)";
    }
    else {
        navBar.style.transform = "translateY(0)";
    }
    lastPosn = window.scrollY;
}

window.addEventListener("scroll",NavEffect)


// For Hamburber button and menu: 

const hamburgerButton = document.querySelector("#hamburger-menu");
const navBar = document.querySelector('nav')
const MobileMenu = document.querySelector("#mobile-menu");
let isMenuOpened = false;

const closeMenu = () => {
    window.addEventListener("scroll",NavEffect)
    hamburgerButton.children[0].classList.remove("cross-bar-1")
    hamburgerButton.children[1].style.opacity = '1'
    hamburgerButton.children[2].classList.remove("cross-bar-2")
    MobileMenu.style.transform = "translateX(-100%)"
    isMenuOpened = false;
    document.body.style.overflow = ""
}

const HamburgerButtonHandeler = () => {
    if(isMenuOpened){
        closeMenu();
    }
    else{
        window.removeEventListener("scroll",NavEffect)
        hamburgerButton.children[0].classList.add("cross-bar-1")
        hamburgerButton.children[1].style.opacity = '0'
        hamburgerButton.children[2].classList.add("cross-bar-2")
        MobileMenu.style.transform = "translateX(0)"
        isMenuOpened = true;
        // document.body.style.overflow = "hidden";
    }
}

hamburgerButton.addEventListener('click', HamburgerButtonHandeler);

Array.from(MobileMenu.children[0].children).forEach(li => li.addEventListener("click", closeMenu))

// programming for count-down timer

const   MainCountdownBox = document.getElementById("countdown")
        DaysBox = document.getElementById("count-days"),
        HoursBox = document.getElementById("count-hours"),
        MinutesBox = document.getElementById("count-mins"),
        SecsBox = document.getElementById("count-secs");

const EventDate = new Date("2026-02-14T09:00:00")

let currentDate = Date.now()

let daysLeft, hoursLeft, secondsLeft; //countdown variables

let difference_sec =    Math.floor((EventDate.getTime() - Date.now())/ 1000 );


const setValuesOfCountDownVariebles = () => {
    difference_sec =  Math.floor((EventDate.getTime() - Date.now())/ 1000 ) // update every time function calls
    let secondsLeft = difference_sec % 60,
        minutesLeft = Math.floor( (difference_sec / 60) % 60 ),
        hoursLeft = Math.floor( (difference_sec / (60*60) ) % 24) ,
        daysLeft = Math.floor(difference_sec / (60*60*24) );

    // Pushing to DOM:
    
    if (difference_sec >0){
        DaysBox.innerText = daysLeft >= 10 ? daysLeft : '0'+ daysLeft;
        HoursBox.innerText = hoursLeft >= 10 ? hoursLeft : '0'+ hoursLeft;
        MinutesBox.innerText = minutesLeft >= 10 ? minutesLeft : '0' + minutesLeft;
        SecsBox.innerText = secondsLeft >= 10 ? secondsLeft : '0' + secondsLeft;
    }
    else{
        MainCountdownBox.innerHTML = `<p class="expired">Startup Expo 2025 is Over!<p>`
    }

}

setValuesOfCountDownVariebles() // initially run the function once.

if  (difference_sec > 0 ) setInterval(setValuesOfCountDownVariebles, 1000);


// film strip seamless effect

const topStrip = document.querySelector('.film-strip-top');
    const bottomStrip = document.querySelector('.film-strip-bottom');

    const resetAnimation = (element) => {
      element.style.animationName = 'none';
      requestAnimationFrame(() => {
        element.style.animationName = 'scroll-strip';
      });
    };

    //  reset animations to keep them in sync
    setInterval(() => {
      resetAnimation(topStrip);
      resetAnimation(bottomStrip);
    }, 20000); 


