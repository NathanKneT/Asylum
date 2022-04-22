import Assets from "./assets.js"
import Globals from "./globals.js"
import HudManager from "./hud.js"
import AudioManager from "./manager/audio_manager.js"

const Hud = new HudManager();
const PsyState = {
    UNSTABLE: { id: 0, text: "Déstabilisé" },
    STABLE: { id: 1, text: "Calme" },
    INJURED: { id: 2, text: "Blessé" },
    NEAT: { id: 3, text: "Soigné" },
    ARMED: { id: 4, text: "Armé" },
    DISTURBED: { id: 5, text: "Perturbé" },
    VIGILANT: { id: 6, text: "Vigilant" },
};

let weapon;
let battery;
let psyState;
let textNodes;

fetch("text.json")
    .then(res => res.json())
    .then(res => {
        textNodes = res;
        startGame();
    });

function startGame() {
    weapon = false;
    battery = Globals.STARTING_BATTERY;
    psyState = PsyState.UNSTABLE;
    document.body.style.backgroundImage = Assets.Image.background;
    switchToStoryId(Globals.STARTING_STORY_ID);
}

function playSoundState(i) { //Sert a gérer tous les fichiers audio
    switch (i) {
        case(1) :
            AudioManager.pauseAll();
            AudioManager.play(Assets.Audio.ambient);
            break;
        case(6) :
            AudioManager.play(Assets.Audio.walkie, 0);
            break;
        case(7) :
            AudioManager.pause(Assets.Audio.walkie);
            AudioManager.play(Assets.Audio.doppel, 0);
            break;
        case(8) :
            AudioManager.play(Assets.Audio.roll, 0);
            break;
        case(9) :
            AudioManager.pause(Assets.Audio.walkie);
            AudioManager.play(Assets.Audio.end, 0);
            AudioManager.play(Assets.Audio.ambient);
            break;
    }
}

function switchToStoryId(storyId) {
    Hud.setBattery(battery);
    Hud.setPsyState(psyState.text);

    const textNode = textNodes.find(textNode => textNode.id === storyId);

    Hud.changeTextDialog(splitString(textNode.text, ' ').join(' '), textNode.options, selectOption);
}

function splitString(stringToSplit, separator) {
    const arrayOfStrings = stringToSplit.split(separator);
    return arrayOfStrings.map(e => `<span> ${e} </span>`);
}

function selectOption(option) {
    AudioManager.play(Assets.Audio.click, 0, false);
    Hud.changeBackgroundColor('#202124');

    let nextTextNodeId = option.nextText;

    if (--battery === 0) {
        nextTextNodeId = Globals.ENDING_STORY_ID;
    }

    switch (psyState) {
        case PsyState.INJURED: //On perd 2 fois plus de batterie quand on est blessé
            battery--;
            break;
        case PsyState.ARMED: //Face a certains ennemis on peut survivre si on est armé
            weapon = true;
            break;
        default:
            break;
    }

    switch (true) {
        case (nextTextNodeId >= 9000) :
            Hud.changeBackgroundColor('#571414');
            playSoundState(9);
            break
        case (nextTextNodeId === 140) :
            psyState = PsyState.VIGILANT;
            break;
        case (nextTextNodeId === 8998) :
            Hud.changeBackgroundColor('#571414');
            AudioManager.play(Assets.Audio.collapse, 0);
            break;
        case (nextTextNodeId === 8000) :
            playSoundState(8)
            Hud.playBackgroundAnimation('roll', '2s', '1');
            break;
        case (nextTextNodeId === 304) :
            psyState = PsyState.NEAT;
            break;
        case (nextTextNodeId === 424) :
            Hud.changeBackgroundColor(Assets.Image.finish);
            break;
        case (nextTextNodeId === 203) :
            AudioManager.play(Assets.Audio.door, 0);
            break;
        case (nextTextNodeId === 423) :
            playSoundState(7)
            psyState = PsyState.DISTURBED;
            break;
        case (nextTextNodeId === 909) :
            AudioManager.play(Assets.Audio.collapse, 0);
            psyState = PsyState.INJURED
            break;
        case (nextTextNodeId === 101) :
            AudioManager.play(Assets.Audio.scarydoor, 0);
            break;
        case (nextTextNodeId === 427) : //FIN 2
            psyState = PsyState.DISTURBED;
            API.endingReached(2);
            break;
        case (nextTextNodeId === 420) :
            if (psyState === PsyState.ARMED) {
                AudioManager.play(Assets.Audio.gun, 0);
                Hud.changeBackgroundColor('#3a2727');
                switchToStoryId(421);
            } else {
                Hud.changeBackgroundColor('#571414');
                playSoundState(9);
                switchToStoryId(9011);
            }
            break;
        case (nextTextNodeId === 809) :
            if (psyState === PsyState.ARMED) {
                AudioManager.play(Assets.Audio.gun, 0);
                switchToStoryId(812);
            } else {
                switchToStoryId(817);
            }
            break;
        case (nextTextNodeId === 861) :
            if (psyState === PsyState.INJURED) {
                AudioManager.play(Assets.Audio.weak_bonk, 0);
                switchToStoryId(870);
            } else {
                AudioManager.play(Assets.Audio.pied_biche, 0);
                switchToStoryId(814);
            }
            break;
        case (nextTextNodeId === 2) :
            playSoundState(1);
            break;
        case (nextTextNodeId === 305) :
            psyState = PsyState.ARMED;
            AudioManager.play(Assets.Audio.gun, 0);
            break;
        case (nextTextNodeId === 873) : //FIN 4 : Abandon
            playSoundState(9);
            Hud.changeBackgroundColor('#571414');
            API.endingReached(4);
            break;
        case (nextTextNodeId === 813) : //FIN 3 : Classique
            Hud.changeBackgroundImage(Assets.Image.finish);
            Hud.changeBackgroundColor('#095919');
            API.endingReached(3);
            psyState = PsyState.STABLE;
            break;
        case (nextTextNodeId === 303) :
            psyState = PsyState.INJURED;
            AudioManager.play(Assets.Audio.glass, 0);
            break;
        case (nextTextNodeId === 703) :
            playSoundState(6)
            break;
        case (nextTextNodeId === 704) : //FIN 1 : Secours
            Hud.changeBackgroundColor('#095919');
            API.endingReached(1);
            psyState = PsyState.STABLE;
            break;
        case (nextTextNodeId <= 0):
            startGame();
            return;
    }

    switchToStoryId(nextTextNodeId);
}