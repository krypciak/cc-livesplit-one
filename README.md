# CrossCode LiveSplit One server
[LiveSplit One](https://one.livesplit.org) is a multiplatform web version of [LiveSplit](https://livesplit.org)  
<br>

![Realeses](https://github.com/CCDirectLink/organization/blob/master/assets/badges/releases%402x.png)  
[1.0.1 (latest)](https://github.com/krypciak/cc-livesplit-one/releases/tag/1.0.1)  
[1.0.0](https://github.com/krypciak/cc-livesplit-one/releases/tag/1.0.0)

## Dependencies
1. [timer](https://github.com/CCDirectLink/CCTimer)

## Initial Setup
1. Make sure [timer](https://github.com/CCDirectLink/CCTimer) is installed
2. Download [CCSpeedrunResources](https://github.com/CCDirectLink/CCSpeedrunResources), place it somewhere and unzip it
3. Copy all the contents of `CCSpeedrunResources/CATEGORY-OF-CHOISE/CCTimer Autosplitters` into `CrossCode/assets/mods/timer/`
4. Download the .ccmod and place it in your mods directory
5. Go to the [LiveSplit One](https://one.livesplit.org) website
6. `Splits` -> `Import` -> `CCSpeedrunResources/CATEGORY-OF-CHOISE/Livesplit Blank Splits/CrossCode - CATEGORY`
7. Click the folder icon on the split after importing
8. `Back`
<br>

## Things to do every time
1. Launch the game
2. Go to the [LiveSplit One](https://one.livesplit.org) website
3. `Connect to Server` -> paste `ws://localhost:5000`
4. A message saying `Connected to server` should pop up in the bottom left corner
5. The timer should start when you click `New Game` in CrossCode

<br>
		

## Building
```bash
git clone https://github.com/krypciak/cc-livesplit-one
cd cc-livesplit-one
npm install
npm run start
# this should return no errors or very few
npx tsc
```
