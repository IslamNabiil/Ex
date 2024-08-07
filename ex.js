// Elements for displaying time and date
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
    innerTime.innerHTML = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${period}`;
    innerDay.innerHTML = dayNum.toString().padStart(2, "0");

    let dayOfWeek = now.getDay();
    let daysOfWeekAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    let daysOfWeekEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    dayAr.innerHTML = daysOfWeekAr[dayOfWeek];
    dayEn.innerHTML = daysOfWeekEn[dayOfWeek];
}

getTime();
setInterval(getTime, 1000); // Update time every second

let totalMoney = document.getElementById('totalMoney');
let accounts = document.querySelectorAll('.left div');

// Save account state and total money to localStorage
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

// Load account state and total money from localStorage
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
            accounts[index].children[1].innerHTML = item.amount;
        });
        totalMoney.innerHTML = savedTotal || total;
    }
}

// Attach event listeners for account visibility toggling
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

// Elements and event listeners for transactions
let addTransactionButton = document.getElementById('addTransactionButton');
let transactionAmountInput = document.getElementById('transactionAmount');
let transTypeSelect = document.getElementById('transType');
let walletTypeSelect = document.getElementById('walletType');
let transactionModal = document.getElementById('transactionModal');
let closeModal = document.getElementById('closeModal');
let plusButton = document.getElementById('addNewTrans');
let transactionDateInput = document.getElementById('transactionDate');

// Show the modal when the plus button is clicked
plusButton.addEventListener('click', function () {
    // Set today's date as the default value
    let today = new Date().toISOString().split('T')[0];
    transactionDateInput.value = today;

    transactionModal.style.display = 'block';
});

// Close the modal when the close button is clicked
closeModal.addEventListener('click', function () {
    transactionModal.style.display = 'none';
});

// Add a new transaction when the button is clicked
addTransactionButton.addEventListener('click', function () {
    let amount = parseFloat(transactionAmountInput.value);
    let transType = transTypeSelect.value;
    let walletType = walletTypeSelect.value;
    let amounts = document.querySelectorAll('.left small');
    
    if (!isNaN(amount) && amount > 0) {
        let updated = false;
        amounts.forEach(amountElem => {
            if (amountElem.getAttribute('value') === walletType) {
                let currentAmount = parseFloat(amountElem.innerHTML);
                if (transType === "ايرادات") {
                    totalMoney.innerHTML = (+totalMoney.innerHTML || 0) + amount;
                    amountElem.innerHTML = currentAmount + amount;
                } else if (transType === "مصروفات") {
                    totalMoney.innerHTML = (+totalMoney.innerHTML || 0) - amount;
                    amountElem.innerHTML = currentAmount - amount;
                }
                updated = true;
            }
        });

        if (updated) {
            // Clear the input fields
            transactionAmountInput.value = '';
            transTypeSelect.value = 'ايرادات';
            walletTypeSelect.value = 'نقديـــــــــــــه';

            // Hide the modal
            transactionModal.style.display = 'none';

            // Save the new state
            saveState();
        } else {
            alert("No matching wallet type found.");
        }
    } else {
        alert("Please enter a valid amount.");
    }
});
