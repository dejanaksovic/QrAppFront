import { FlashMessage } from "./Flash.js";
import { getUserIdFromUrl } from "./helpers.js";
import { Router } from "./PagePaths.js";
import { PageShifter } from "./Pageshifter.js";

export class RequestHandler {
  constructor (shifter, successRedirect, role) {
    if(!role)
      throw Error("Role must be given");
    if(!["admin", "worker", "user"].includes(role))
      throw Error("Role doesn't exist");
    if(!shifter)
      throw Error("Page shifter must be given");
    if(!(shifter instanceof PageShifter))
      throw Error("Shifter is not of instane page shifter");
    // Checks pass
    this.role = role;
    this.shifter = shifter;
    this.successRedirect = successRedirect;
    // flash message
    this.flash = new FlashMessage();
  }

  #checkRequestValidity(options) {
    const { url, method, queryParams } = options;
    if(!url)
      throw Error("Base url must be given");
    if(!method)
      throw Error("Method must be given");
    
    if(!queryParams) {
      return url;
    }    

    // Itterate over query params
    let queryString = "";
    for(let [key, value] of Object.entries(queryParams)) {
      if(!(typeof(value) === "string") && !(typeof(value)==="number")) {
        throw Error(`Invalid value type: ${value}`);
      }
      queryString += `${key}=${value}&`;
    }
    return `${url}?${queryString}`
  }

  #isInvalidPassword(role) {
    switch(role) {
      case "admin": {
        localStorage.removeItem("adminPassword");
        sessionStorage.removeItem("adminPassword");
        return Router.adminLogin();
      }
      case "worker": {
        localStorage.removeItem("workerPassword");
        sessionStorage.removeItem("workerPassword");
        return Router.workerLogin();
      } 
    }
  }

  async #handleSendingRequest(url, method, password, body) {
    let res;
    try {
      res = await fetch(url, {
        method: method || "GET",
        headers: {
          "Content-Type" : "application/json",
          "authorization": password,
        },
        body: JSON.stringify(body),
      })
      let data;
      try {
        data = await res.json();
      }
      catch(err) {
        return {ok: true};
      }

      const { message } = data || {};

      if(!res.ok) {
        return {
          status: res.status,
          message
        }
      }

      return data;
    }
    catch(err) {
      return {
        status: 500,
      };
    }
  }

  #handleErrors(res, role) {

    if(res instanceof Error) {
      this.shifter.showPageOnly("500");
      return true;
    }

    // Short circut
    if(!res?.status) {
      return false;
    }

    const { status, message } = res || {};

    if(status === 500) {
      this.shifter.showPageOnly("500");
      return true;
    }

    if(status === 401 || status === 403) {
      this.#isInvalidPassword(role);
      return true;
    }

    if(status === 404) {
      this.shifter.showPageOnly("404");
      return true;
    }

    if(message) {
      this.flash.showMessage(message, "error");
      return true;
    }
    
    return true;
  }
  
  async doRequest(options, successMessage) {
    const { method, password, body } = options;
    
    this.shifter.showLoader();
    const fullUrl = this.#checkRequestValidity(options);
    
    const res = await this.#handleSendingRequest(fullUrl, method, password, body);
    const error = this.#handleErrors(res, this.role);

    if(error) {
      this.shifter.hideLoader();
      return;
    }

    if(this.successRedirect && successMessage) {
      this.flash.leaveMessage(successMessage, "success");
      this.successRedirect();
    }

    if(successMessage) {
      this.flash.showMessage(successMessage, "success");
    }

    this.shifter.hideLoader();
    return res?.res || res;
  }
}