
<table>
  <tr>
    <td>
      <h1>Summary</h3>
      <p>Mr. Fridge is a grocery tracking app built for iOS and Android that prioritizes convenience and clarity to make managing groceries and reducing food waste easy, effective, and completely free and accessible to all.</p>
    </td>
    <td>
      <img src="assets/images/mrFridgeVectorLogo.svg" width="400" alt="Mr. Fridge Logo, featuring a fridge with a face wearing a tophat against a green background">
    </td>
  </tr>
</table>


## Main Features
- A simple, readable design, that splits groceries into their storage location: Fridge, Pantry, or Freezer, and orders items by how close they are to expiration.
- Two methods to enter groceries: Manual (single item) entry and a receipt scanner for entering multiple items.
- A database of food items and the length of time they tend to last, built from information referencing [stillTasty.com](https://www.stilltasty.com/).
  - This allows the app to make automatic estimates, so the user doesn’t have to go scouring each product for its expiration label and enter it into the app. 
- Notifications on tracked items a few days before they’re predicted to expire, and once again at about the day they expire.

# Findings / Testing
Testing was conducted over a period of about a week and a half, and included both Android and iOS users. It focused on:
- Convenience
- Accuracy
- Percieved benefit from the  Receipt Scanner
- And whether or not Mr. Fridge met its goal of reducing food waste

## Primary Finding
My primary finding is that Mr. Fridge was successful in decreasing how often users forgot about food in their kitchen, especially how often they forgot about it until it went bad.

When asked how often people forgot items until they went bad, responses ranged from "On Rare Ocassions" to "Sometimes" and "Often" when Mr. Fridge wasn't being used. While using Mr. Fridge, the responses began at "Never" (forgetting items until they went bad), and ranged up to "On Rare Ocassions" and "Sometimes."

Users also reported that the expiration dates were accurate enough to be valuable, especially in tandem with the notifications. 

# In Detail
## Architecture
Mr. Fridge was built using React Native, Expo to handle building the code, maintianing metadata, and deployment and Expo Go for local development. It has a SQLite databse, and uses FastAPI and TesseractOCR for the singular endpoint hosted via Railway.

## Receipt Scanenr
The app takes the image the user submits and uploads it to the OCR endpoint. The image is preprocessed by upscaling it and making it grayscale to improve the accuracy of Tesseract's OCR. Once the text has been received by Mr. Fridge, a process of fuzzy matching occurs, matching whatever each line says to an item in the database. 
- The OCR endpoint code is available [at this repository](https://github.com/kpr0vence/tesseract-demo).

_I developed this algorithm myself_ utilizing a library called fuse.js.

# For the Future
Mr. Fridge is still in its beta testing phase, though results have been positive, and the app is complete enough to deploy. Really now it’s just a bureaucratic issue that requires overcoming a few administrative hurdles to get it onto the app stores.
