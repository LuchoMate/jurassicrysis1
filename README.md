# Jurassicrysis
#### CS50's Web Programming with Python and JavaScript.
**Author:** Luis Balladares.


## Table of contents:

 

 1. #### About the project
 2. #### Distinctiveness and Complexity
 3. #### Overview
 4. #### Files
 5. #### Running the application
 7. #### Acknowledgements



# About the project

**Jurassicrysis** is a Dinosaurs collectible card game where you can buy booster packs with in-game money, build your own deck, trade your cards with other users, and most importantly, play against the computer.

It was made using Javascript, HTML, SCSS in the frontend and Python through Django/Django in the backend.

Additionally, the following libraries/frameworks were utilized:

 - **React**: React was used mainly to render and store information about the cards when playing the game. It was also used to render cards in pages like collection or database, as some minor details.
 - **GSAP**: For cards animations through the screen, dynamic menus and information screens.
 - **barba.js**: In order for the site to behave as a Single Page Application, a simple transition was included when navigating through different pages.
 - **Django REST**: To communicate with the backend in a clean way using json, Django REST was added to the *INSTALLED_APPS* setting.
 - **Webpack**: This module bundler was used in order to being able to call React  and ReactDOM anywhere in the project.

# Distinctiveness and Complexity

## Distinctiveness
At its core this project is distinct from any other one on this course. First, the concept of it is not related at all with Social Networks, e-Mail systems or e-Commerce.
Second, the idea of a collectible card game is far from being related to our previous tasks. 

Lastly, the objective or goal of the game, that being collecting all cards and using them to play, and being able to trade them with other users is a concept that I believe is not related with the direction/purpose of sites we built before.

## Complexity
Building a dynamic page in which plenty of components can interact with each other and cause effects in the DOM  as well as creating the logic behind a turn-based game is in my opinion one of the strongest points on why this project is more complex than its predecessors.

Fully using the HTML Drag & Drop API (both for desktop and mobile versions) as well as the advantages of storing and managing data that React provides in combination with GSAP makes of this project a fun and complex -but rewarding- experience.


I have to mention the backend, in which I learnt how to use Django REST to facilitate the communication between a number of views and JS functions.

Finally, this projects meets the requirements we were asked because:

 - It uses Django with 4 models.
 - It uses Javascript on the frontend.
 - It's fully responsive.

# Overview
A simplified structure of the project is as it follows:

**backend**

 - Models.
 - Views.
 - Tests.
 - Serializers.

**frontend**

 - Templates -> HTML files.
 - Static -> Images, Audio, styles.scss.
 - src -> Components -> (App.js and MainApp.js)
 

This structure's intention is to separate as best as possible the back and front ends of the project. 
## Frontend
### barba.js
From barba's docs:
>**Barba.js** is a small _(7kb minified and compressed)_ and easy-to-use library that helps you create fluid and smooth transitions between your website’s pages. It makes your website run like a **SPA**  _(Single Page Application)_ and help reduce the delay between your pages, minimize browser HTTP requests and enhance your user’s web experience.

This was achieved by manipulating the *divs* elements with classes *transition1* and *transition2* from *layout.HTML* through the file **MainApp.js**

Barba.js was included in this project using CDN with a generic script markup;

> src="https://cdn.jsdelivr.net/npm/@barba/core">

The movement of the "jaws" effect was done by transitioning its ScaleY and Opacity properties with **GSAP**.

### GSAP

According to GreenSock:
> The GreenSock Animation Platform (GSAP) animates anything JavaScript can touch (CSS properties, SVG, React, canvas, generic objects, whatever) and solves countless browser inconsistencies (...) animation ultimately boils down to changing property values many times per second, making something appear to move, fade, spin, etc. GSAP snags a starting value, an ending value and then interpolates between them 60 times per second.

The following was animated using GSAP:

 - Moving cards across the board.
 - Drawing cards from deck.
 - All kinds of menus appearing and dissapearing.
 - Pages transitions.

This library was called using CDN:
> src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.1/gsap.min.js"

### React
> "React is a JavaScript library for building user interfaces"

React plays a big role on this project for it stores and handles data regarding cards information like LifePoints, Attack or Dinosaurs types as well as rendering and destroying said cards when playing. It was also utilized to display cards and tables on Collection, Database, Trade Cards and Leaderboards.

Since a React App consists of a single HTML file and this project was multi-page, and as well as the need of using React on different files, I decided to incorporate it by compiling .js files via **Webpack**.

### Webpack
> "At its core,  **webpack**  is a  _static module bundler_  for modern JavaScript applications. When webpack processes your application, it internally builds a  [dependency graph](https://webpack.js.org/concepts/dependency-graph/)  which maps every module your project needs and generates one or more  _bundles_.

For the previous stated reasons is why Webpack was used to convert *App.js* and *MainApp.js* into files which could import React and ReactDOM into them.

## Backend
### Models
The following models were created to store data:
#### Player
Extends the *AbstractUser* class and stores user's data like Victories, Losses, Experience and Dinocoins.
#### Card
This model stores each individual card related information:

 - Name
 - Attack
 - LifePoints
 - Cost
 - Type (Carnivorous, herviborous, aquatic, flying or event)
 - Weakness
 - Rarity
 - Size
 - Condition (ability)
 - Event effect (for event type cards)

#### Collection
Stores each individual card collected by players on the database:

 - Owner: *Foreign Key* of Player
 - Card_collected: *Foreign Key* of Card
 - quantity: Number of cards collected for that specific card
 - on_deck: Number of cards added to the player's deck with a maximum of 2
#### Trade
This model handles incoming and outgoing trades requests:
 - Sender: *Foreign Key* of Player
 - Recipient: *Foreign Key* of Player
 - Sender_card: Card offered by Sender, *Foreign Key* of Card
 - Recipient_card: Card requested by Sender, *Foreign Key* of Card

### Views

A list of Views and their purpose:
 - **api_get_card**: [GET]Gets a card given its ID.
 - **api_return_card_id**: [GET]Gets a card  ID given its name.
 - **api_player_collection**: [GET]Returns the logged user's collection.
 - **api_player_deck**: [GET]Returns the logged user's deck.
 - **api_shuffled_deck**: [GET]Same as player_deck but shuffled in order to play.
 - **api_update_deck**: [PUT, DELETE]Adds or removes a card from player's deck.
 - **api_deck_composition**: [GET]Returns logged user's deck composition as an array of integers (Carnivorous, herviborous, etc.) 
 - **api_collection_total**: [GET] Gets logged user's number of collected cards as well of quantity of each one.
 - **api_leaderboard**: [GET]Gets all players stats to display on leaderboard.
 - **api_opp_deck** :[GET]Returns a shuffled array of the computer's deck.
 - **api_player_wins** :[PUT] Adds Experience, Wins and Dinocoins to the logged user depending on the difficulty received.
 - **api_player_loses**: [PUT] Adds +1 to logged user's losses count.
 - **api_buy_pack**:[PUT] Adds and returns 3 cards of the requested category, provided logged user has >= 5000 Dinocoins.
 - **api_incoming_requests**: [GET] Gets logged user's incoming trade requests.
 - **api_outgoing_requests**: [GET] Gets logged user's outgoinf trade requests.
 - **api_check_available**: [GET] Checks if a given card is available for trade, returning a status code of 200 along with a list of players that posess that card.
 - **api_my_avl_cards**: [GET] Returns an array of logged user's available cards to offer for trade (quantity > on_deck).
 - **api_all_avl_cards**: [GET] Gets all available cards of logged user (used in Deck Manager)
 - **api_new_trade**: [POST] Creates a new trade request.
 - **api_cancel_trade**[DELETE] Cancels a trade given its ID.
 - **api_accept_trade**[POST] Accepts a trade given its ID.

### Tests
The following tests were ran with 0 issues found:

 - **test_getInvalidCardId**: Tries getting an card with an invalid ID.
 - **test_getInvalidCardName**: Tries getting a card by an invalid name.
 - **test_countPlayerCards**: Counts the number of different cards of a given user.
 - **test_cardAvailableTrade**: Checks if a given card is available for trade.
 - **test_addInvalidCardDeck**: Attempts to add to deck a card that is not in logged user's collection.
 - **test_removeInvalidCardDeck**: Attempts to remove an invalid card from logged user's deck.
 - **test_playerWinsInvalid**: Tries putting an invalid content on PUT request after player wins.
 - **test_buyInvalidPack**: Tests if user can buy an invalid type of booster pack.
 - **test_offerInvalidCard**: Tries to start a new trade with a card that the user does not have in his/her collection.
 - **test_askInvalidCard**: Attempts to request a trade for a card that the recipient player does not own.
 - **test_deleteInvalidTrade**: Tries to delete a trade that does not involve logged user.
 - **test_acceptInvalidTrade**: Attempts to accept a trade for a card that the recipient player does not own.

### Serializers
> Serializers allow complex data such as querysets and model instances to be converted to native Python datatypes that can then be easily rendered into `JSON`, `XML` or other content types.

Some Views made use of Serializers to return data back to the Frontend. The following models used a Serializer

 - Collection
 - Card
 - Trade

# Files
## HTML
All templates are located in */frontend/templates/frontend/* with their purpose being to render each requested page:

 - database.HTML
 - deckmanager.HTML
 - index.HTML
 - layout.HTML
 - leaderboards.HTML
 - login.HTML
 - mycollection.HTML
 - play.HTML
 - profile.HTML
 - register.HTML
 - shop.HTML
 - trader.HTML

Notable files here are layout.HTML which contains the scripts to load GSAP and barba.js and play.HTML for it's the only exception given it doesn't load barba for transitioning and it loads its own script (*App.js*).

## SCSS
Located in */frontend/static/frontend/stylesScss* is the styles.scss file that controls all the project styling. This file is transformed to a .css file located in */frontend/static/frontend/* via Scout-App (https://scout-app.io)

## JavaScript
This project makes use of 4 JavaScript files that control all interactions between the user and the site.

 #### dropdown
This file is located in */frontend/static/frontend/dropdownmenu/dropdowns.js* and it contains the instructions to manipulate the navigation bar of the site. Additionally adds a responsive button when the user is navigating with a small device.

#### MainApp
*/frontend/src/components/MainApp.js*

This JS file controls two things. It contains the calls to *barba.js*  for transitioning between pages through the function *barba.init()* and it manages the site logic for all of the HTML files except *play.HTML* which uses its own js file.

This file is compiled using Webpack into */frontend/static/frontend/Main/main.js*

#### playtransition
*/frontend/static/frontend/transitions/playtransition.js*

An exclusive transition for *play.HTML* . It manages the following logic when the user enters:

 - **Checks deck**: Checks if the logged user owns a valid deck (20 cards). If not, is not allowed to proceed any further.
 - **Checks orientation**: If the device is using portrait mode (height larger than width) the user is prompted to switch it to landscape mode, otherwise is prevented to proceed to the next step.
 - **Select difficulty**: Easy, medium or hard difficulties. The higher the difficulty, the better cards that the computer owns, but also offers better rewards of Experience and Dinocoins.
 - **Rock-papers-scissors**: A game of rock papers scissors to decide who begins the game.

#### App
*/frontend/src/components/App.js*

Controls the entire logic of the game, from drawing both players starting hands to handle whether the user won or lost the game.

The ***game flow*** is as it follows:

- ***Rock-papers-scissors game***: decides which player begins.
- ***Player/opponent's turn starts***: draw a card.
- ***Play cards***: and attack dinosaurs or eggs.
- ***Check opponent's players eggs***: after an attack. If player still has eggs left, continue. Otherwise, tha game is over (Win/Lose deppending on the situation).
- ***End Turn***: when there are still eggs available on both sides.

As previously stated, all data pertaining Attack, LifePoints, receiving damage as well as rendering and destroying cards is handled by React components. In specific the following functions:

 - *class* SketchPlayerCard
 - *class* SketchOppCard

In charge of the opponent's behavior is the **async function cpuAi()**. This function does the following:

 - If the cpu's hand is > 0, attempts to play a card.
 - Try and play a card. If there is enough energy left, place it on the board.
 - Repeat the previous step one more time.

After finising playing cards:

 - Check if cpu has Dinosaurs on the board.
 - For each Dinosaur, attempts to perform an attack.
 - Generate a random number between 0 and 1.
 - If number is greater than 0.4, checks if player has dinosaurs to receive an attack.
 - If there are, attack a random dinosaur, else attack player's eggs.
 - Otherwise if number is less or equal than 0.4, attack player's eggs immediately.

Any attack performed on each player's eggs is handled by function **destroyEgg(who)** which, in case of either player having less or equal to zero eggs, calls functions **youWin()** or **youLose()** depending on the case. These functions present the user with an appropiate screen informing of the game result and granting Experience and Dinocoins in a favorable case.

# Running the application

 Django REST is needed to run this project:
 > pip install djangorestframework

To start the server:

 1. Navigate to the project's root folder.
 2. Open the command line.
 3. Execute the following command:
> python manage.py runserver

# Acknowledgements
The author would like to thank everyone who made this course available for free. Special thanks to David J. Malan and in particular to Brian Yu for being an excellent teacher.


