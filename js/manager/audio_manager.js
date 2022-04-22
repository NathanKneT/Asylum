export default class AudioManager {
    static #playingAudios = [];

    static play(audio, time = null, stoppable = true) {
        if (time !== null) {
            audio.currentTime = time;
        }

        audio.play().then(() => {
            if (AudioManager.#playingAudios.indexOf(audio) === -1 && stoppable) {
                audio.pause();
            }
        });

        if (AudioManager.#playingAudios.indexOf(audio) === -1) {
            if (stoppable) {
                AudioManager.#playingAudios.push(audio);
            }
        }
    }

    static pause(audio) {
        if (AudioManager.#playingAudios.indexOf(audio) !== -1) {
            if (audio.started) {
                audio.pause();
            }
        }
    }

    static pauseAll() {
        AudioManager.#playingAudios.forEach(audio => {
            if (audio.started) {
                audio.pause();
            }
        });
        AudioManager.#playingAudios = [];
    }
}