class API {
  static apiBaseUrl = "https://neo.notworking.ovh";

  static async request(requestType, target, data, inBody) {
    let params = "";
    if (data !== undefined && !inBody) {
      params = "?";
      Object.keys(data).forEach(key => {
        params += key + "=" + data[key] + "&";
      });
    }

    var requestOptions;
    if (!inBody) {
      requestOptions = {
        method: requestType,
        redirect: 'follow'
      };
    }
    else {
      requestOptions = {
        method: requestType,
        redirect: 'follow',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      };
    }

    return fetch(this.apiBaseUrl + target + params, requestOptions).then(res => res.json());
  }

  static async get(target, data) {
    console.log(target + " " + data);
    return this.request('GET', target, data, false);
  }

  static async post(target, data) {
    console.log(target + " " + data);
    return this.request('POST', target, data, true);
  }

  static async signup(data) {
    return this.post("/account/signup", data);
  }

  static async login(data) {
    return this.post("/account/login", data);
  }

  static async avatarList() {
    return this.get("/avatar/list", undefined);
  }

  static async avatarFetch(data) {
    return this.get("/avatar/fetch", data);
  }

  static async avatarAchievements(data) {
    return this.get("/avatar/achievements", data);
  }

  static async rankingGlobal(data) {
    return this.get("/ranking/global", data);
  }

  static async systemList(data) {
    return this.get("/system/list", data);
  }

  static async systemHealth(data) {
    return this.get("/system/health", data);
  }
}