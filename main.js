// Make a variable for the sensor, and one for whether or not it's dark
var sensor;
var isDark;

// What is the limit for how dark we think it is?
// Play around with this to find a limit that makes sense for you
var darknessThreshold = 150;

// UNCOMMENT HERE FOR MORE
// Uncomment the next line, if you want to see what kind of voices you have on your phone as well as their indices and languages
// showInstalledVoices();

// Check if we can use the Ambient Light Sensor
if ("AmbientLightSensor" in window) {
  // Get ready to use the ambient light sensor
  sensor = new AmbientLightSensor();
  // When we make readings, call this function
  sensor.onreading = reactToAmbientLightSensor;
  // Start the ambient light sensor
  sensor.start();
}

function reactToAmbientLightSensor() {
  // Write the lumen value to the HTML element with the ID 'log'
  // sensor.illuminance is the raw value of the ambient light sensor
  document.getElementById("log").innerText = sensor.illuminance;
  // Find out if it's dark enough
  if (sensor.illuminance < darknessThreshold) {
    isDark = true;
  } else {
    isDark = false;
  }

  // Depending on the darkness, do different things
  if (isDark) {
    // Write in the HTML element with the id 'is-it' if it's dark
    document.getElementById("is-it").innerText = "Yes";
    // Make the browser say 'Hello darkness my old friend' if it's dark
    speak("Hello darkness my old friend");
    // Add the darkness class to the HTML body so we can make the screen dark
    document.body.classList.add("darkness");
  } else {
    // Write in the HTML element with the id 'is-it' if it's not dark
    document.getElementById("is-it").innerText = "No...";
    // Remove the darkness class to the HTML body so we can make the screen light again
    document.body.classList.remove("darkness");
  }
}

// Speaks out a sentence using the Web Speech API, a.k.a Speech Synthesis
// When we call the function, we can decide what to say, by changing the value of 'txt'
// Be aware that the user must have done something on the screen before you can call this function
// e.g. they must have clicked a button, written some text or something similar
function speak(txt) {
  // Only do something, if there is actually support for speech syn
  if (window.speechSynthesis) {
    // Only do something, if the browser is not already speaking
    if (!window.speechSynthesis.speaking) {
      // Get ready to say something
      var utterThis = new SpeechSynthesisUtterance(txt);
      // Setup what to do when we're done with speaking
      utterThis.onend = function(event) {
        // Just log some information to the console
        console.log(event);
      };
      // Setup what to do if we get an error
      utterThis.onerror = function(event) {
        // Log some information about the error
        console.log(event);
      };
      // Get all of the voices available on the device
      var voices = window.speechSynthesis.getVoices();
      // Make a variable for the chosen voice
      var chosenVoice;
      // Go through all the voices and pick the Danish one
      // You can change 'da_DK' to something else if you want
      for (var i = 0; i < voices.length; i++) {
        // Choose by language
        // e.g. fr_FR, ru_RU, ja_JP, it_IT
        if (voices[i].lang === "da_DK" && chosenVoice === undefined) {
          chosenVoice = voices[i];
        }

        // UNCOMMENT HERE FOR MORE
        // or uncomment this to choose by index and change the number
        /*if(i === 21 && chosenVoice === undefined) {
          chosenVoice = voices[i];
        }*/
      }

      // Make sure that we have chosen a voice
      if (chosenVoice !== undefined) {
        // Set the voice and language to the chosen one
        utterThis.voice = chosenVoice;
        utterThis.lang = chosenVoice.lang;
        // Set the values for the speech synthesis
        // Setting pitch to 0 gives a deep voice, and 1 gives a light voice
        utterThis.pitch = 1;
        // Setting rate to 0 gives a slow voice, and 1 gives a fast voice
        utterThis.rate = 1;
        // Volume is pretty self explanatory
        utterThis.volume = 1;

        // Speak it out
        window.speechSynthesis.speak(utterThis);
      }
    }
  }
}

function showInstalledVoices() {
  if (window.speechSynthesis) {
    // Get all of the voices available on the device
    var voices = window.speechSynthesis.getVoices();

    // Save a reference to the html element where we are putting the list
    var list = document.getElementById("voicelist");
    // Get ready to put the html together as a string
    var listHtml = "";
    // Go through all the voices
    for (var i = 0; i < voices.length; i++) {
      listHtml +=
        "<li>" + i + ": " + voices[i].name + "(" + voices[i].lang + ")</li>";
    }
    // Show the list of voices in the html
    list.innerHTML = listHtml;

    // If there were no voices yet, try again in 1000 milliseconds
    if (voices.length < 1) {
      setTimeout(showInstalledVoices, 1000);
    }
  }
}
