const messagesElement = document.getElementById('messages');
const messageInputElement = document.getElementById('message-input');
const sendButtonElement = document.getElementById('send-button');
let isFormOpen = false; // keep track of whether a form is open or not
let hasFormMessageBeenShown = false; // keep track of whether the "Please fill in the existing form first" message has been shown
let hasUnknownMessageBeenShown = false; // keep track of whether the "Sorry, I don't understand. Please try again." message has been shown

// add default bot message when the page loads
addMessageToChatbot('Hello! How can I help you?', 'bot');

// add event listener to send button
sendButtonElement.addEventListener('click', sendMessage);

// add event listener to message input element for "keyup" event
messageInputElement.addEventListener('keyup', (event) => {
  // check if the key pressed is "Enter" (key code 13)
  if (event.keyCode === 13) {
    sendMessage();
  }
});

function sendMessage() {
  const message = messageInputElement.value;
  addMessageToChatbot(message, 'user');
  messageInputElement.value = '';

  if (message.toLowerCase()) {
    if (isFormOpen) {
      if (!hasFormMessageBeenShown) {
        addMessageToChatbot('Please fill in the existing form first.', 'bot');
        hasFormMessageBeenShown = true;
        hasUnknownMessageBeenShown = false;
      }
    } else {
      addMessageToChatbot('Please provide your details', 'bot');
      addFormToChatbot();
      isFormOpen = true;
      hasFormMessageBeenShown = false;
      hasUnknownMessageBeenShown = false;
    }
  } else {
    if (!hasUnknownMessageBeenShown) {
      addMessageToChatbot('', 'bot');
      hasFormMessageBeenShown = false;
      hasUnknownMessageBeenShown = true;
    }
  }
}


function addMessageToChatbot(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add(`${sender}-message`);
  messageElement.textContent = message;
  messagesElement.appendChild(messageElement);
}


function addFormToChatbot() {
  const formElement = document.createElement('form');
  formElement.setAttribute('action', 'https://drsbooking.com/');
  formElement.setAttribute('method', 'GET');

  const firstNameInput = createTextInput('First Name', 'first-name');
  const lastNameInput = createTextInput('Last Name', 'last-name');
  const emailInput = createTextInput('Email', 'email');
  const phoneInput = createTextInput('Phone', 'phone');

  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.textContent = 'Submit';

  formElement.appendChild(firstNameInput);
  formElement.appendChild(lastNameInput);
  formElement.appendChild(emailInput);
  formElement.appendChild(phoneInput);
  formElement.appendChild(submitButton);

  messagesElement.appendChild(formElement);

  submitButton.addEventListener('click', (event) => {
    event.preventDefault();
  
    // check if all required fields are filled in
    const requiredFields = formElement.querySelectorAll('[required]');
    const isFormValid = [...requiredFields].every(field => {
      if (field.value.trim() === '') {
        field.setCustomValidity('Please fill in this field.');
        field.reportValidity();
        return false;
      }
      return true;
    });
  
    if (isFormValid) {
      // hide the form and submit button
      formElement.style.display = 'none';
      submitButton.style.display = 'none';
  
      // show the thank you message
      addMessageToChatbot('Thank you for submitting your details.', 'bot');
  
      // show the appointment button
      const appointmentButton = document.createElement('button');
      appointmentButton.textContent = 'Appointment';
      appointmentButton.addEventListener('click', () => {
        window.open('https://drsbooking.com/', '_blank');
      });
      messagesElement.appendChild(appointmentButton);

      isFormOpen = false; // reset the flag when the form is successfully submitted
    }
  });
}


function createTextInput(label, name) {
  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');

  const inputLabel = document.createElement('label');
  inputLabel.setAttribute('for', name);
  inputLabel.textContent = label;

  const inputElement = document.createElement('input');
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('name', name);
  inputElement.setAttribute('required', '');
  inputElement.addEventListener('invalid', () => {
    inputElement.setCustomValidity('Please fill in this field');
  });
  inputElement.addEventListener('input', () => {
    inputElement.setCustomValidity('');
  });

  inputContainer.appendChild(inputLabel);
  inputContainer.appendChild(inputElement);

  return inputContainer;
}
