let runningNumberDisplay = document.getElementById("runningNumber");
let collectedDigits = [];
let randomnumberInterval;
let collectionInterval;
let timerInterval;

function checkvalidity() {
  let inputNumber = document.getElementById("inputNumber").value;

  // Clear the result
  document.getElementById("results").innerHTML = "";

  // Check if user enter valid 5 digits number
  if (!inputNumber || inputNumber.length !== 5 || isNaN(inputNumber)) {
    alert("Error: Please enter a valid 5-digit number.");
    return false;
  }

  return true;
}

function startCountDownTimer() {
  let timeLeft = 300; // 5 minutes in seconds
  const timerDisplay = document.getElementById("timer");

  // Display the initial time
  timerDisplay.innerText = formatTime(timeLeft);

  // Create a countdown interval
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = formatTime(timeLeft);

    // Check if time has run out
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.innerText = "00:00";
      timerDisplay.style.color = "red";
    }
  }, 1000);
}

// Function to format time in MM:SS format
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}`;
}

// Display 5 random number every second
function startRandomNumberDisplay() {
  randomnumberInterval = setInterval(() => {
    let randomNum = Math.floor(Math.random() * 90000) + 10000;
    runningNumberDisplay.innerText = randomNum;
  }, 1000);
}

// Handle data collection
function startDataCollection() {
  // Check validity of digits
  if (checkvalidity()) {
    // Start time countdown
    startCountDownTimer();
    // Start the running number display
    startRandomNumberDisplay();

    collectedDigits = [];
    let count = 0; // To keep track the number of minutes passed

    // Collect the last digits every minit
    collectionInterval = setInterval(() => {
      // Every minute get the last digit of the number and store in collectedDigits
      let currentNumber = runningNumberDisplay.innerText;

      // Split the number into two part - before last digit and last digit
      const beforeLastDigit = currentNumber.slice(0, -1);
      const lastDigit = currentNumber.slice(-1);

      // If 5 minutes reached, clear interval and send the result to the server
      if (count >= 4) {
        // Clear all time interval
        clearInterval(collectionInterval);
        clearInterval(randomnumberInterval);
        clearInterval(timerInterval);
        // Push the last 'lastDigit' and send to server
        collectedDigits.push(lastDigit);
        sendToServer(collectedDigits);
        // Calculate the result
        matchInputNumber();
        return;
      }

      // Else, set the inner HTML with the styled last digit
      runningNumberDisplay.innerHTML = `${beforeLastDigit}<span style="color: red;">${lastDigit}</span>`;

      collectedDigits.push(lastDigit);
      count++;
    }, 60000);
  }
}

// Handle user's click event
document
  .getElementById("startCollection")
  .addEventListener("click", startDataCollection);

// Sends the collected digits to the server via a POST request to "config.php"
function sendToServer(digits) {
  fetch("config.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ digits: digits }),
  });
}

// Match the input with collected number and show the results
function matchInputNumber() {
  let inputNumber = document.getElementById("inputNumber").value;
  let formedNumber = collectedDigits.join("");

  // Check how many digits match (individual matches)
  const matchdigits = (num1, num2) => {
    let tempFormedNumber = num2.split(""); // Convert to array for easy removal
    let matchNum = 0;
    for (let i = 0; i < num1.length; i++) { 
      // Check the all number index of inputNumber in FormedNumber 
      let index = tempFormedNumber.indexOf(num1[i]);
      // If index found in FormedNumber
      if (index !== -1) {
        matchNum++;
        tempFormedNumber.splice(index, 1); // Remove the matched digit to avoid redundant
      }
    }
    return matchNum;
  };
  let matchCount = matchdigits(inputNumber, formedNumber);

  // Detect continuous sequence matches
  const longestContinuousMatch = (num1, num2) => {
    const num1Str = num1.toString();
    const num2Str = num2.toString();
    let maxMatchLength = 0;

    // Traverse both strings and find the longest matching continuous sequence
    for (let i = 0; i < num1Str.length; i++) {
      for (let j = 0; j < num2Str.length; j++) {
        let currentMatchLength = 0;

        // Compare digits while they match continuously
        while (
          i + currentMatchLength < num1Str.length &&
          j + currentMatchLength < num2Str.length &&
          num1Str[i + currentMatchLength] === num2Str[j + currentMatchLength]
        ) {
          currentMatchLength++;
        }

        // Update maxMatchLength if a longer match is found
        maxMatchLength = Math.max(maxMatchLength, currentMatchLength);
      }
    }
    return maxMatchLength;
  };
  let maxContinuousMatch = longestContinuousMatch(inputNumber, formedNumber);

  // Check for permutation matches
  const arePermutations = (num1, num2) => {
    const num1Str = num1.toString();
    const num2Str = num2.toString();
    if (num1Str.length !== num2Str.length) return false;
    let sortedStr1 = num1Str.split("").sort().join("");
    let sortedStr2 = num2Str.split("").sort().join("");
    return sortedStr1 === sortedStr2;
  };
  let permutationsMatch = arePermutations(inputNumber, formedNumber);

  // Output results
  document.getElementById("results").innerHTML = `
        <p style="color: yellow;">Final Collection Result: ${formedNumber}</p>
        <p>Matched Digits: ${matchCount}</p>
        <p>Max Continuous Match: ${maxContinuousMatch}</p>
        <p>Permutation Match: ${permutationsMatch ? "Yes" : "No"}</p>
    `;
}
