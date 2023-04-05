import GameObj from "./Game.js";

const Game = new GameObj();

const initApp = () => {
  // all time data

  initAllTimeData();

  // update the scoreboard

  updateScoreBoard();

  // listen for a player choice

  listenForPLayerChoice();

  // listen enter key

  listenForEnterKey();

  // listen for the play again

  listenForPLayAgain();

  // lock the gameboard height

  lockComputerGameBoardHeight();

  // set focus to start new game

  document.querySelector("h1").focus(); // cand un nou joc e incarcat se va focusa pe rock paper scrissors, asa incat cei care folosesc tab sa inceapa direct de acolo si sa poata sari apoi la alegeri

  // astea-s task-urile pe care le am de facut in partea de JS
};

document.addEventListener("DOMContentLoaded", initApp);

const initAllTimeData = () => {
  Game.setP1Alltime(parseInt(localStorage.getItem("p1AllTime")) || 0);
  Game.setCpAlltime(parseInt(localStorage.getItem("cpAllTime")) || 0);
};

const updateScoreBoard = () => {
  // All time

  const p1Ats = document.getElementById("p1_all_time_score");
  p1Ats.textContent = Game.getP1AllTime();
  p1Ats.ariaLabel = `Player One has ${Game.getP1AllTime()} all time wins`;

  const cpAts = document.getElementById("cp_all_time_score");
  cpAts.textContent = Game.getCpAllTime();
  cpAts.ariaLabel = `Computer has ${Game.getCpAllTime()} all time wins`;

  // Session

  const p1s = document.getElementById("p1_session_score");
  p1s.textContent = Game.getP1Session();
  p1s.ariaLabel = `Player One has ${Game.getP1Session()} wins this session`;

  const cps = document.getElementById("cp_session_score");
  cps.textContent = Game.getCpSession();
  cps.ariaLabel = `Computer One has ${Game.getCpSession()} wins this session`;
};

const listenForPLayerChoice = () => {
  const P1Images = document.querySelectorAll(
    ".playerBoard .gameboard__square img"
  );
  P1Images.forEach((img) => {
    img.addEventListener("click", (event) => {
      if (Game.getActiveStatus()) return;
      Game.startGame();
      const playerChoice = event.target.parentElement.id;
      updateP1Message(playerChoice);
      P1Images.forEach((img) => {
        if (img === event.target) {
          img.parentElement.classList.add("selected");
        } else {
          img.parentElement.classList.add("not-selected");
        }
      });

      //animation
      computerAnimationSequence(playerChoice);
    });
  });
};

const listenForEnterKey = () => {
  window.addEventListener("keydown", (event) => {
    if (event.code === "Enter" && event.target.tagName === "IMG") {
      event.target.click();
    }
  });
};

const listenForPLayAgain = () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    resetBoard(); // TODO:
  });
};

const lockComputerGameBoardHeight = () => {
  const cpGameBoard = document.querySelector(".computerBoard .gameboard");
  const cpGBStyles = getComputedStyle(cpGameBoard);
  const height = cpGBStyles.getPropertyValue("height");
  cpGameBoard.style.minHeight = height;
};

const updateP1Message = (choice) => {
  let p1msg = document.getElementById("p1msg").textContent;

  p1msg += ` ${choice[0].toUpperCase()}${choice.slice(1)}! `;

  /* p1msg += ` ${properCase(choice)}! `; */

  document.getElementById("p1msg").textContent = p1msg;
};

const computerAnimationSequence = (playerChoice) => {
  let interval = 1000;
  setTimeout(() => computerChoiceAnimation("cp_rock", 1), interval);
  setTimeout(() => computerChoiceAnimation("cp_paper", 2), (interval += 500));
  setTimeout(
    () => computerChoiceAnimation("cp_scissors", 3),
    (interval += 500)
  );

  setTimeout(() => countDownFade(), (interval += 750));

  setTimeout(() => {
    deleteCountDown();
    finishGameFlow(playerChoice);
  }, interval += 1000);

  setTimeout(() => askUserToPlayAgain(), interval += 1000);
};

const computerChoiceAnimation = (elementId, number) => {
  const element = document.getElementById(elementId);

  // elementId e div-ul care contine rock si ii dam un nr

  element.firstElementChild.remove(); // va fi imaginea din el
  const p = document.createElement("p"); // cream elementul paragraf

  p.textContent = number;
  element.appendChild(p);

  // deci la alegerea computer-ului o sa dam remove la imaginea cu piatra si o sa afisam acolo imaginea 1, apoi la paper 2 iar la scrissors 3, intr-un paragraf ce a fost creat.
};

const countDownFade = () => {
  const countDown = document.querySelectorAll(
    ".computerBoard .gameboard__square p"
  );
  countDown.forEach((el) => {
    el.className = "fadeOut";
  });
};

const deleteCountDown = () => {
  const countDown = document.querySelectorAll(
    ".computerBoard .gameboard__square p"
  );
  countDown.forEach((el) => {
    el.remove();
  });
};

const finishGameFlow = (playerChoice) => {
  const computerChoice = getComputerChoice();
  const winner = determineWinner(playerChoice, computerChoice);

  const actionMessage = buildActionMessage(
    winner,
    playerChoice,
    computerChoice
  );

  displayActionMessage(actionMessage);

  // update aria result

  updateAriaResult(actionMessage, winner);

  // update score state

  updateScoreState(winner);

  // update persistent date

  updatePersistentData(winner);

  // update score board

  updateScoreBoard();

  // update winner message

  updateWinnerMessage(winner);

  // display computer choice

  displayComputerChoice(computerChoice);
};

const getComputerChoice = () => {
  const randomNumber = Math.floor(Math.random() * 3);
  const rpsArray = ["rock", "paper", "scissors"];
  return rpsArray[randomNumber];
};

/* const determineWinner = (playerChoice, computerChoice) => {
  if (playerChoice === computerChoice) return "tie";
  if (
    (playerChoice === "rock" && computerChoice === "paper") ||
    (playerChoice === "paper" && computerChoice === "scissors") ||
    (playerChoice === "scissors" && computerChoice === "rock")
  )
    return "computer";
  return "player";
}; */

const determineWinner = (player, computer) => {
  if (player === computer) return "tie";
  if (
    player === "rock" && computer === "paper" ||
    player === "paper" && computer === "scissors" ||
    player === "scissors" && computer === "rock"
  )    return "computer";
  return "player";
};


const buildActionMessage = (winner, playerChoice, computerChoice) => {
  if (winner === "tie") return "Tie game";
  if (winner === "computer") {
    const action = getAction(computerChoice);
    return `${computerChoice[0].toUpperCase()}${computerChoice.slice(1)} ${action} ${playerChoice[0].toUpperCase()}${playerChoice.slice(1)
    }.`;

    /* ${computerChoice[0].toUpperCase()}${computerChoice.slice(1)}! 
    playerChoice[0].toUpperCase()}${playerChoice.slice(1) */

  } else {
    const action = getAction(playerChoice);
    return `${playerChoice[0].toUpperCase()}${playerChoice.slice(1)} ${action} ${computerChoice[0].toUpperCase()}${computerChoice.slice(1)}.`;
  }
};

const getAction = (choice) => {
  return choice === "rock" ? "smashes" : choice === "paper" ? "wrap" : "cuts";
};

/* const properCase = (string) => {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}; */

const displayActionMessage = (actionMessage) => {
  const cpmsg = document.getElementById("cpmsg");
  cpmsg.textContent = actionMessage;
};

const updateAriaResult = (result, winner) => {
  const ariaResult = document.getElementById("playAgain");
  const winnerMessage =
    winner === "player"
      ? "Felicitari, esti castigator"
      : winner === "computer"
      ? "Computer-ul a castigat"
      : "";
  ariaResult.ariaLabel = `${result} ${winnerMessage} Click or press enter to play again. `;
};

const updateScoreState = (winner) => {
  if (winner === "tie") return;

  winner === "computer" ? Game.cpWins() : Game.p1Wins();
};

const updatePersistentData = (winner) => {
  const store = winner === "computer" ? "cpAllTime" : "p1AllTime";
  const score =
    winner === "computer" ? Game.getCpAllTime() : Game.getP1AllTime();

  localStorage.setItem(store, score);
};

const updateWinnerMessage = (winner) => {
  if (winner === "tie") return;

  const message =
    winner === "computer"
      ? "🔥🔥Computer Wins🔥🔥"
      : "🏆🏆🚀🚀 You Won 🚀🚀🏆🏆";

  const p1msg = document.getElementById("p1msg");
  p1msg.textContent = message;
};

const displayComputerChoice = (choice) => {
  const square = document.getElementById("cp_paper");
  createGameImage(choice, square);
};

const askUserToPlayAgain = () => {
  const playAgain = document.getElementById("playAgain");
  playAgain.classList.toggle("hidden");
  playAgain.focus();
};

const resetBoard = () => {
  const gameSquares = document.querySelectorAll(".gameboard div");
  gameSquares.forEach(el => {
    el.className = "gameboard__square";
  });

  const cpSquares = document.querySelectorAll(
    ".computerBoard .gameboard__square"
  );
  cpSquares.forEach((el) => {
    if (el.firstElementChild) el.firstElementChild.remove();
    if (el.id === "cp_rock") createGameImage("rock", el);
    if (el.id === "cp_paper") createGameImage("paper", el);
    if (el.id === "cp_scissors") createGameImage("scissors", el);
  });

  document.getElementById("p1msg").textContent = "Player One Chooses...";
  document.getElementById("cpmsg").textContent = "Computer Chooses...";

  const ariaResult = document.getElementById("playAgain");
  ariaResult.ariaLabel = "Player One Chooses";
  document.getElementById("p1msg").focus();
  document.getElementById("playAgain").classList.toggle("hidden");
  Game.endGame();
};

const createGameImage = (icon, appendToElement) => {
  const image = document.createElement("img");
  image.src = `Img/${icon}.png`;
  image.alt = icon;
  appendToElement.appendChild(image);
};
