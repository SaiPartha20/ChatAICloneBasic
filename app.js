let lastExecutionTime = 0;
const API_KEY = "YOUR_OPENAI_API_KEY";
const submitButton = document.querySelector("#submit");
const outputElement = document.querySelector("#output");
const inputElement = document.querySelector("input");
const historyElement = document.querySelector(".history");
const buttonElement = document.querySelector("button");
function changeInput(value) {
  const inputElement = document.querySelector("input");
  inputElement.value = value;
}
async function getMessage() {
  const currentTime = Date.now();
  const timeDiff = currentTime - lastExecutionTime;
  if (timeDiff < 300) {
    // Adjust this time (in milliseconds) as needed to limit the frequency of requests
    console.log("Too many requests. Please wait before trying again.");
    return;
  }

  lastExecutionTime = currentTime;
  console.log("clicked");
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: inputElement.value }],
      max_tokens: 100,
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    console.log(data);
    outputElement.textContent = data.choices[0].message.content;
    if (data.choices[0].message.content) {
      const pElement = document.createElement("p");
      pElement.textContent = inputElement.value;
      historyElement.append(pElement);
      pElement.addEventListener("click", () =>
        changeInput(pElement.textContent)
      );
    }
  } catch (error) {
    console.error(error);
  }
}
submitButton.addEventListener("click", getMessage);
function clearInput() {
  inputElement.value = "";
}
buttonElement.addEventListener("click", clearInput);
