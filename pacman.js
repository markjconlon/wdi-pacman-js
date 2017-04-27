// Setup initial game stats
var score = 0;
var lives = 2;
var powerPellets = 4;
var totalDots = 240;
var eatenGhosts = 0;
var level = 1;

// Define your ghosts here

var inky = {
  menu_option : '1',
  name: 'Inky',
  colour: 'Red',
  character: 'Shadow',
  edible: false
};

var blinky = {
  menu_option: '2',
  name: 'Blinky',
  colour: 'Cyan',
  character: 'Speedy',
  edible: false
};

var pinky = {
  menu_option: '3',
  name: 'Pinky',
  colour: 'Pink',
  character: 'Bashful',
  edible: false
};

var clyde = {
  menu_option: '3',
  name: 'Pinky',
  colour: 'Pink',
  character: 'Bashful',
  edible: false
};

ghosts = [inky, blinky, pinky, clyde];

// Draw the screen functionality
function drawScreen() {
  clearScreen();
  if (levelProgress()) {
    process.exit();
  }
  setTimeout(function() {
    displayStats();
    displayMenu();
    displayPrompt();
  }, 10);
}

function clearScreen() {
  console.log('\x1Bc');
}

function displayStats() {
  console.log('Level:' + level)
  console.log('Score: ' + score + '     Lives: ' + lives );
  console.log('Dots left: ' + totalDots);
  console.log('\nPower-Pellets: ' + powerPellets );
}

function displayMenu() {
  console.log('\n\nSelect Option:\n');  // each \n creates a new line
  console.log('(d) Eat Dot');
  if (powerPellets > 0) {
    console.log('(p) Eat Power-Pellets');
  }
  if (totalDots >= 10) {
    console.log('(g) Gorge on Dots!');
  }
  if (totalDots >= 100) {
    console.log('(i) Inhale Dots!');
  }
  console.log('(1) Eat Inky ' + edibleGhost(inky));
  console.log('(2) Eat Blinky ' + edibleGhost(blinky));
  console.log('(3) Eat Pinky ' + edibleGhost(pinky));
  console.log('(4) Eat Clyde ' + edibleGhost(clyde));
  console.log('(q) Quit');
}

function displayPrompt() {
  // process.stdout.write is similar to console.log except it doesn't add a new line after the text
  process.stdout.write('\nWaka Waka :v '); // :v is the Pac-Man emoji.
}


// Menu Options

function edibleGhost(ghost) {
  if (ghost.edible) {
    return '(edible)';
  } else {
    return '(inedible)';
  }
}
function eatDot() {
  console.log('\nChomp!');
  score += 10;
  totalDots -= 1;
}

function gorgeDot() {
  console.log('\nmunch!');
  score += 100;
  totalDots -= 10;
}

function inhaleDots() {
  console.log('\nMUNCH!');
  score += 1000;
  totalDots -= 100;
}

function eatPowerPellet(){
  console.log('\nPower Pellet Consumed');
  score += 50;
  powerPellets -= 1;
  ghosts.forEach(function(ghost) {
    ghost.edible = true;
  });
}

function eatGhost(ghost){
  if (ghost.edible) {
    console.log('\nYou ate ' + ghost.name + ' who is the ' + ghost.character);
    ghost.edible = false;
    switch (eatenGhosts) {
      case 0:
        score += 200;
        break;
      case 1:
        score += 400;
        break;
      case 2:
        score += 800;
        break;
      case 3:
        score += 1600;
        eatenGhosts = 0;
        break;
      default:
        break;
    }
    eatenGhosts += 1;
}   else {
      console.log('\nYou were killed by ' + ghost.name + ' the ' + ghost.colour + ' ghost');
      lives -= 1;
      displayStats();
      checkLives();
    }

}

function checkLives(){
  if (lives <= 0) {
    process.exit();
  }
}

function levelProgress(){
  if (level === 256 && (powerPellets === 0 && totalDots === 0)) {
    console.log('You win!');
    return true;
  }else if (level != 256 && (powerPellets === 0 && totalDots === 0)) {
    level += 1;
    totalDots = 240;
    powerPellets = 4;
    return false;
  }
}

// Process Player's Input
function processInput(key) {
  switch(key) {
    case '\u0003': // This makes it so CTRL-C will quit the program
    case 'q':
      process.exit();
      break;
    case 'd':
      if (levelProgress()) {
        process.exit();
        break;
      }
      eatDot();
      break;
    case 'p':
      if (powerPellets > 0) {
        if (levelProgress()) {
          process.exit();
          break;
        }
        eatPowerPellet();
        break;
      };
      break;
    case 'g':
      if (levelProgress()) {
        process.exit();
        break;
      }
      gorgeDot();
      break;
    case 'i':
      if (totalDots >= 100 && totalDots <= 230){
        inhaleDots();
        break;
      } else if (totalDots >= 100 && totalDots === 240) {
          console.log('\n At least try eating a dot first');
          break;
      } else if (totalDots >= 100 && totalDots > 230){
          console.log('\nEat more or try gorging (g) before you try to inhale those!');
          break;
        };
      break;
    case '1':
      eatGhost(inky);
      break;
    case '2':
      eatGhost(blinky);
      break;
    case '3':
      eatGhost(pinky);
      break;
    case '4':
      eatGhost(clyde);
      break;
    default:
      console.log('\nInvalid Command!');
  }
}


//
// YOU PROBABLY DON'T WANT TO CHANGE CODE BELOW THIS LINE
//

// Setup Input and Output to work nicely in our Terminal
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

// Draw screen when game first starts
drawScreen();

// Process input and draw screen each time player enters a key
stdin.on('data', function(key) {
  process.stdout.write(key);
  processInput(key);
  setTimeout(drawScreen, 300); // The command prompt will flash a message for 300 milliseoncds before it re-draws the screen. You can adjust the 300 number to increase this.
});

// Player Quits
process.on('exit', function() {
  console.log('\n\nGame Over!\n');
});
