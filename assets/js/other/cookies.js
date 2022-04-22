class Cookie {
    static get(cookie) {
        let name = cookie + "=";
        let decodedCookie = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < decodedCookie.length; i++) {
            let actcoo = decodedCookie[i];
            while (actcoo.charAt(0) == ' ')
                actcoo = actcoo.substring(1);
            if (actcoo.indexOf(name) == 0)
                return actcoo.substring(name.length, actcoo.length);
        }

        return "";
    }

    static set(cookie, value, computeTime, expireTime) {
        let computedExpire = "expires=" + computeTime(expireTime).toUTCString();
        document.cookie = cookie + "=" + value + ";" + computedExpire + ";path=/";
    }

    static delete(cookie) {
        const dateNow = new Date();
        dateNow.setTime(dateNow.getTime() - 1);
        document.cookie = `${cookie}=; expires=${dateNow.toUTCString()}`;
    }

    static has(name) {
        let cookie = this.get(name);
        return !(cookie === null || cookie === '');
    }

    static debug() {
        console.log(document.cookie);
    }

    static computeInDays(time) {
        const dateNow = new Date();
        dateNow.setTime(dateNow.getTime() + (time * 24 * 60 * 60 * 1000));
        return dateNow;
    }

    static computeInHours(time) {
        const dateNow = new Date();
        dateNow.setTime(dateNow.getTime() + (time * 60 * 60 * 1000));
        return dateNow;
    }

    static computeInMinute(time) {
        const dateNow = new Date();
        dateNow.setTime(dateNow.getTime() + (time * 60 * 1000));
        return dateNow;
    }
}