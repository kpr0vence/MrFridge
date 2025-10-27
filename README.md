![Mr. Fridge Banner](./assets/images/mrFridgeBanner.png)
 Mr. Fridge’s is a grocery tracking app whose primary purpose is to issue notifications on items *before* they become unusable. The app will strike a balance between convenience, user-friendliness, accuracy, and notification customization, to help users reduce food waste and save money on groceries. 

 # Frontend
 The app is developed using React Native, specifically making use of the `(tabs)` file structure. The app is currently composed of two main tabs, and an additional button.
 ## 1. Groceries View
 The Groceries view displays the three sections that groceries can be stored in: **the Fridge, Pantry, and Freezer**. 
<div style="display: inline-flex; flex-direction: row; gap: 10px; align-items: center;">
  <img src="./assets/images/exampleContainer.webp" alt="Example Container" style="height: 150px; border-radius: 10px;">
  <p>Each one gives a preview of the number of items it contains as well as how many are close to expiration or are expired.</p>
</div>
<div style="display: inline-flex; flex-direction: row; gap: 10px; align-items: center;">
  <p>Clicking on any of these containers will show a details panel, listing each item. From here the user has the ability to edit the name or expiration length of any item, or mark it as "eaten".</p>
  <img src="./assets/images/exampleContainerDetails.webp" alt="Example Container" style="height: 200px; border-radius: 10px;">
  <img src="./assets/images/editModal.webp" alt="Edit items modal" style="height: 200px; border-radius: 10px;">
</div>

