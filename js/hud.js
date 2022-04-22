export default class HudManager {
    #textElement = document.getElementById("text");
    #container = document.getElementsByClassName("container")[0];
    #optionButtonsElement = document.getElementById("option-buttons");
    #stats = document.getElementById("stats");
    #psy = document.getElementById("psy");

    changeTextDialog(text, options, btnCallback) {
        this.#textElement.innerHTML = text;
        this.#optionButtonsElement.innerHTML = "";

        for (let option of options) {
            let button = document.createElement("button");

            button.innerHTML = option.text;
            button.classList.add("btn");
            button.addEventListener("click", () => {
                btnCallback(option);
            });

            this.#optionButtonsElement.appendChild(button)
        }
    }

    changeBackgroundColor(color) {
        this.#container.style.backgroundColor = color;
    }

    changeBackgroundImage(image) {
        document.body.style.backgroundImage = image;   
    }

    playBackgroundAnimation(animation, duration, iterationCount) {
        this.#container.style.animationName = animation;
        this.#container.style.animationDuration = duration;
        this.#container.style.iterationCount = iterationCount;
    }

    setBattery(battery) {
        this.#stats.innerHTML = battery + "🔋";
    }

    setPsyState(psy) {
        this.#psy.innerHTML = "Etat : " + psy;
    }
}