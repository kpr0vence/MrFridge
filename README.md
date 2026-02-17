![Mr. Fridge Banner](./assets/images/mrFridgeBanner.png)
Mr. Fridge’s is a grocery tracking app whose primary purpose is to issue notifications on items _before_ they become unusable. The app will strike a balance between convenience, user-friendliness, accuracy, and notification customization, to help users reduce food waste and save money on groceries.

# Frontend

The app is developed using React Native, specifically making use of the `(tabs)` file structure. The app is currently composed of two main tabs, and an additional button.

## 1. Groceries View

The Groceries view displays the three sections that groceries can be stored in: **the Fridge, Pantry, and Freezer**.

<div style="display: inline-flex; flex-direction: row; gap: 10px; align-items: center;">
  <img src="./assets/images/exampleContainer.webp" alt="Example Container" style="height: 150px; border-radius: 10px;">
  <p>Each one gives a preview of the number of items it contains as well as how many are close to expiration or are expired.</p>
</div>

_Screenshots from the dev version of Mr. Fridge_

<div style="display: inline-flex; flex-direction: row; gap: 10px; align-items: center;">
  <p>Clicking on any of these containers will show a details panel, listing each item. From here the user has the ability to edit the name or expiration length of any item, or mark it as "eaten".</p>
  <img src="./assets/images/exampleContainerDetails.webp" alt="Example Container" style="height: 200px; border-radius: 10px;">
  <img src="./assets/images/editModal.webp" alt="Edit items modal" style="height: 200px; border-radius: 10px;">
</div>

_Screenshots from the dev version of Mr. Fridge_

<div style="display: inline-flex; flex-direction: row; gap: 10px; align-items: flex-start;">
  <div>
  
  ## 2. Customize Notification View

  <p>This view allows the user to customize the notifications they recieve from the app. The intention is to leave the user in control of how often they recieve notifications and at what time of day the notifications are issued. </p>
  <p>These notifications are sent out <strong>before</strong> the given item would go bad, giving users the forwarning they need to factor the item into their meal planning before they would have to throw it out.</p>

_Screenshots from the dev version of Mr. Fridge_

  </div>
  <img src="./assets/images/notifsMockup.png" alt="Example Container" style="height: 400px; border-radius: 10px;">
</div>

## 3. Center "Plus" Button

This button enables the user to add new groceries. When pressing it, the user will be given the choice to:

- Manually enter items, great for single-item entries _or leftovers_
- Or to scan a reciept, which is great for mass entry and maximum convenience.

### Receipt Scanner

Mr. Fridge will use ocular pattern recognition to determine the products listed on the reciept, and discard non food items, such as personal hygine products. After scanning the reciept, the user will be asked to decide the storage location of each item.

From there, an algorithm will be applied to determine the generic product type associated with each item, and the expected shelf life of the given product.
This algorithm will be trained using data from the website [www.StillTasty.com](https://www.stilltasty.com/). It will have the flexibility to adjust predictions based on the storage location of the item (fridge, freezer, or pantry).

# Backend

The backend uses SQLite to locally store user data in a table called items. Each Item record has:

- id
- name
- expiration_date
- location_id (either 1, 2, or 3 corresponding to fridge, pantry, or freezer)

The SQLite database was set up using information from [this tutorial](https://www.youtube.com/watch?v=vgPdAARd6Gw). It creates up a users table/databse. I built off of this knowledge and functionality to create the table above. Of note: The SQLite queries are done following the proper guidelines to prevent basic SQL injection.

After establishing the database, I found that the best way to provide app-wide access to the data and associated functions _and keep the information stateful_ was to create a new context, called `DataContext.tsx`. By wrapping the app in this, all components and tabs have access to the data and CRUD and other functions within `DataContext.tsx`. The component manages all SQLite queries and functions associated with the data, such as finding the number of items close to expiration.

### SQLite and JS Date Representation

**Challenge**: SQLite doesn’t have a dedicated Date type. Handling dates is very important for my application, so this may be enough of an issue to find a new storage system. For now, I will create an implementation and then test it.

#### How Each Displays Dates

- JavaScript Date: `new Date();`
- SQLite: `'YYYY-MM-DD HH:MM:SS.SSS'`
  - This is ISO8601, though I wonder if the timestamp part is necessary, since I just need the day.
  - Storing the date in a TEXT column in this format will allow me to still order by date.

**JS to SQLite:**

```
const jsDate = new Date();
const sqliteTextDate = jsDate.toISOString();
```

**SQLite o JS:**

```
const sqliteTextDate = '2025-11-08 16:09:00.000';
const jsDate = new Date(sqliteTextDate);
```

# Exporting

Export App: `eas update --channel default`
<img src="./assets/images/expoGo.png" alt="Expo Go App Launch QR Code" style="height: 200px; border-radius: 10px;">

## Interacting with FastAPI

1. Run the `update-env-ip.sh` script: `bash update-env-ip.sh`, which will set the host configuration parameters in your `.env` file based on your local network.

2. When you run FastAPI, make sure you bind the server to 0.0.0.0 (which will work on your local computer and on the LAN like eduroam). (use the command `poetry run uvicorn main:app --reload --host 0.0.0.0` when running the tesseract-demo repo)

It should work!
