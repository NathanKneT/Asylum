class GameModel {
  constructor() {
    this.startTime = new Date();
  }

  bind(controller) {}

  getData(gameType) {
    const data = {
      gameName: "Sword Tournament Online (API)",
      maxScore: undefined,
      achievementCount: undefined,
    };

    return data;
  }

  getActualConvertedTime() {
    let date = new Date();
    let hour = date.getHours().toString().padStart(2, "0");
    let minute = date.getMinutes().toString().padStart(2, "0");

    return hour + "h" + minute;
  }

  getElapsedConvertedTime() {
    let diff = new Date(new Date() - this.startTime);
    let hour = diff.getUTCHours().toString().padStart(2, "0");
    let minute = diff.getUTCMinutes().toString().padStart(2, "0");
    let sec = diff.getUTCSeconds().toString().padStart(2, "0");

    return hour + "h" + minute + "m" + sec;
  }
}

class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.bind(this);
    this.view.bind(this);
  }

  handleUpdateData = (gameType) => {
    let result = this.model.getData(gameType);
    this.view.displayData(result);
  };

  handleUpdateRealTime = () => {
    let result = this.model.getActualConvertedTime();
    this.view.displayRealTime(result);
  };

  handleUpdateElapsedTime = () => {
    let result = this.model.getElapsedConvertedTime();
    this.view.displayElapsedTime(result);
  };
}

class GameGetView {
  constructor() {
    this.gameoverlayContentHtml = document.getElementById("game_overlay");
    this.iframe = this.gameoverlayContentHtml.contentDocument;
    this.gameNameTextHtml = this.iframe.getElementById(
      "game_overlay_game_name"
    );
    this.maxScoreTextHtml = this.iframe.getElementById(
      "game_overlay_max_score"
    );
    this.achievementCountTextHtml = this.iframe.getElementById(
      "game_overlay_succes_count"
    );
    this.backButtonHtml = this.iframe.getElementById("game_overlay_back");
    this.elapsedSessionTextHtml = this.iframe.getElementById(
      "game_overlay_elapsed_session"
    );
    this.timeTextHtml = this.iframe.getElementById("game_overlay_real_time");
    this.maxScoreContentHtml = this.iframe.getElementById(
      "game_overlay_max_score_content"
    );
    this.achievementCountContentHtml = this.iframe.getElementById(
      "game_overlay_succes_count_content"
    );
    this.gameType = this.iframe.body.dataset.game;
  }

  bind(controller) {
    this.bindGetUser(controller.handleUpdateData);
    this.bindRealTime(controller.handleUpdateRealTime);
    this.bindElapsedTime(controller.handleUpdateElapsedTime);
  }

  /* Binding */

  bindGetUser(handler) {
    if (this.isOverlayDisplayed()) handler(this.gameType);
    document.addEventListener("keyup", (event) => {
      event.preventDefault();
      if (event.key === "Escape") {
        this.toggleOverlay();
        if (this.isOverlayDisplayed()) handler(this.gameType);
      }
    });
    this.iframe.addEventListener("keyup", (event) => {
      event.preventDefault();
      if (event.key === "Escape") {
        this.toggleOverlay();
        if (this.isOverlayDisplayed()) handler(this.gameType);
      }
    });
  }

  bindRealTime(handler) {
    setInterval(() => {
      handler();
    }, 1);
  }

  bindElapsedTime(handler) {
    setInterval(() => {
      handler();
    }, 1);
  }

  /* Called externally */

  displayData(data) {
    this.setGameName(data.gameName);
    if (data.maxScore === undefined && data.achievementCount === undefined) {
      this.setMaxScore(data.maxScore);
      this.setAchievementCount(data.achievementCount);
      this.hidePlayerMetrics();
    } else {
      this.displayPlayerMetrics();
      this.setMaxScore(data.maxScore);
      this.setAchievementCount(data.achievementCount);
    }
  }

  displayRealTime(time) {
    this.timeTextHtml.innerText = time;
  }

  displayElapsedTime(time) {
    this.elapsedSessionTextHtml.innerText = time;
  }

  /* Called Internally */

  setGameName(name) {
    //this.gameNameTextHtml.innerText = name;
  }

  hidePlayerMetrics() {
    if (!this.maxScoreContentHtml.classList.contains("d-none"))
      this.maxScoreContentHtml.classList.add("d-none");
    if (!this.achievementCountContentHtml.classList.contains("d-none"))
      this.achievementCountContentHtml.classList.add("d-none");
  }

  displayPlayerMetrics() {
    if (this.maxScoreContentHtml.classList.contains("d-none"))
      this.maxScoreContentHtml.classList.remove("d-none");
    if (this.achievementCountContentHtml.classList.contains("d-none"))
      this.achievementCountContentHtml.classList.remove("d-none");
  }

  setMaxScore(score) {
    this.maxScoreTextHtml.innerText = score;
  }

  setAchievementCount(count) {
    this.achievementCountTextHtml.innerText = count;
  }

  toggleOverlay() {
    this.gameoverlayContentHtml.classList.toggle("d-none");
  }

  isOverlayDisplayed() {
    return !this.gameoverlayContentHtml.classList.contains("d-none");
  }
}
