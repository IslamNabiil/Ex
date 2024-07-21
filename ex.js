let innerYear = document.getElementById('year');
let innerTime = document.getElementById('time');
let innerDay = document.getElementById('day');
let dayAr = document.getElementById('dayAr');
let dayEn = document.getElementById('dayEn');

function getTime() {
    let now = new Date();
    let year = now.getFullYear();
    let hours = now.getHours();
    let seconds = now.getSeconds();
    let minutes = now.getMinutes();
    let dayNum = now.getDate();

    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    innerYear.innerHTML = year;
    innerTime.innerHTML = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2,"0")} ${period}`;
    innerDay.innerHTML = dayNum.toString().padStart(2, "0");

    let dayOfWeek = now.getDay();
    let daysOfWeekAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    let daysOfWeekEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let displayDayWeekNameAr = daysOfWeekAr[dayOfWeek];
    let displayDayWeekNameEn = daysOfWeekEn[dayOfWeek];
    dayAr.innerHTML = displayDayWeekNameAr;
    dayEn.innerHTML = displayDayWeekNameEn;
}

getTime();
setInterval(getTime, 1000); // Update time every second

let totalMoney = document.getElementById('totalMoney');
let accounts = document.querySelectorAll('.left div');


function saveState() {
    let state = [];
    let total = 0;
    accounts.forEach(account => {
        let amount = Number(account.children[1].innerHTML);
        let isVisible = account.children[0].classList.contains('fa-eye');
        if (isVisible) {
            total += amount;
        }
        state.push({ visible: isVisible, amount: amount });
    });
    localStorage.setItem('accountState', JSON.stringify(state));
    localStorage.setItem('totalMoney', total);
}

function loadState() {
    let state = JSON.parse(localStorage.getItem('accountState'));
    let savedTotal = localStorage.getItem('totalMoney');

    if (state) {
        let total = 0;
        state.forEach((item, index) => {
            if (item.visible) {
                accounts[index].children[0].classList.add('fa-eye');
                accounts[index].children[0].classList.remove('fa-eye-slash');
                total += item.amount;
            } else {
                accounts[index].children[0].classList.remove('fa-eye');
                accounts[index].children[0].classList.add('fa-eye-slash');
            }
        });
        totalMoney.innerHTML = savedTotal || total;
    }
}

function getTotal() {
    accounts.forEach(account => {
        account.children[0].addEventListener('click', function () {
            let amount = Number(account.children[1].innerHTML);
            if (account.children[0].classList.contains('fa-eye')) {
                account.children[0].classList.remove('fa-eye');
                account.children[0].classList.add('fa-eye-slash');
                totalMoney.innerHTML = +totalMoney.innerHTML - amount;
            } else {
                account.children[0].classList.add('fa-eye');
                account.children[0].classList.remove('fa-eye-slash');
                totalMoney.innerHTML = +totalMoney.innerHTML + amount;
            }
            saveState();
        });
    });

    saveState(); // Save the initial state
}

loadState(); // Load the saved state on page load
getTotal();




// Target the plus button
let addNewTransButton = document.getElementById('addNewTrans');

// Add a click event listener to the button
addNewTransButton.addEventListener('click', function() {
    // Define the action you want to perform when the button is clicked
    alert('Plus button clicked!'); // You can replace this with your actual functionality
});