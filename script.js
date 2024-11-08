let runningNumberDisplay = document.getElementById("runningNumber");
let collectedDigits = [];
let randomnumberIntervel;
let collectionInterval;

// Display 5 random number every second
function startRandomNumberDisplay() {
  let inputNumber = document.getElementById("inputNumber").value;

  // Check if user enter valid 5 digits number
  if (!inputNumber || inputNumber.length !== 5 || isNaN(inputNumber)) {
    alert("Error: Please enter a valid 5-digit number.");
    return;
  }

  // Clear the result
  document.getElementById("results").innerHTML = "";

  randomnumberIntervel = setInterval(() => {
    let randomNum = Math.floor(Math.random() * 90000) + 10000;
    runningNumberDisplay.innerText = randomNum;
  }, 1000);
}

// Handle data collection
function startDataCollection() {
  // Start the running number display
  startRandomNumberDisplay();

  collectedDigits = [];
  let count = 0; // To keep track the number of minutes passed

  // Collect the last digits every minit
  collectionInterval = setInterval(() => {
    // If 5 minutes reached, clear interval and send the result to the server
    if (count >= 5) {
      clearInterval(collectionInterval);
      clearInterval(randomnumberIntervel);
      sendToServer(collectedDigits);
      matchInputNumber();
      return;
    }

    // Else, every minute get the last digit of the number and store in collectedDigits
    let currentNumber = runningNumberDisplay.innerText;
    collectedDigits.push(currentNumber.slice(-1));
    count++;
    console.log(collectedDigits);
  }, 1000);
}

// Handle user's click event
document
  .getElementById("startCollection")
  .addEventListener("click", startDataCollection);

// Using fetch method to send the collected digits to the server
function sendToServer(digits) {
  fetch("config.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ digits: digits }),
  });
}

// Match the input with collected number and show the result
function matchInputNumber() {
  let inputNumber = document.getElementById("inputNumber").value;
  let formedNumber = collectedDigits.join("");

  // Count how many digits match (individual matches)
  let matchCount = 0;
  let tempFormedNumber = formedNumber.split(""); // Convert to array for easy removal

  for (let i = 0; i < inputNumber.length; i++) {
    let index = tempFormedNumber.indexOf(inputNumber[i]);
    if (index !== -1) {
      matchCount++;
      tempFormedNumber.splice(index, 1); // Remove the matched digit
    }
  }

  // Detect continuous sequence matches
  let maxContinuousMatch = 0;
  for (let i = 0; i < inputNumber.length; i++) {
    let subMatchLength = 0;
    for (let j = 0; j + i < inputNumber.length && j < formedNumber.length; j++) {
      if (inputNumber[i + j] === formedNumber[j]) {
        subMatchLength++;
      } else {
        break;
      }
    }
    maxContinuousMatch = Math.max(maxContinuousMatch, subMatchLength);
  }

  // Check for permutation matches
  const arePermutations = (str1, str2) => {
    if (str1.length !== str2.length) return false;
    let sortedStr1 = str1.split("").sort().join("");
    let sortedStr2 = str2.split("").sort().join("");
    return sortedStr1 === sortedStr2;
  };
  let permutationsMatch = arePermutations(inputNumber, formedNumber);

  // Output results
  document.getElementById("results").innerHTML = `
        <p style="color: yellow;">Final Collection Result: ${formedNumber}</p>
        <p>Matched Digits: ${matchCount}</p>
        <p>Continuous Match: ${maxContinuousMatch}</p>
        <p>Permutation Match: ${permutationsMatch ? "Yes" : "No"}</p>
    `;
}
