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

    console.log(queryParams);
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

  async doRequest(options, successMessage) {
    const { method, password, body } = options;

    const fullUrl = this.#checkRequestValidity(options);
    let res, data;
    try {
      res = await fetch(fullUrl, {
        method: method || "GET",
        headers: {
          "Content-Type" : "application/json",
          "authorization" : password,
        },
        body: JSON.stringify(body),
      })
      try {
        data = await res.json();
      }
      catch(err) {
        ;
      }
    }
    catch(err) {
      return this.shifter.showPageOnly("500");
    }

    const message = data?.message;

    if(res.ok) {
      if(successMessage && this.successRedirect) {
        this.flash.leaveMessage(successMessage, "success");
        return this.successRedirect();
      }
      if(successMessage) {
        return this.flash.showMessage(successMessage, "success");
      }
    }
    if(res.status === 500) {
      return this.shifter.showPageOnly("500");
    }
    if(res.status === 401 || res.status === 403) {
      // Refresh storage local and session
      localStorage.removeItem("workerPassword");
      localStorage.removeItem("adminPassword");
      sessionStorage.removeItem("adminPassword");
      sessionStorage.removeItem("adminPassword");
      switch(this.role) {
        case "admin": {
          return Router.adminLogin();
        }
        case "worker": {
          return Router.workerLogin(getUserIdFromUrl(window.location.search));
        }
      }
      return
    }
    if(res.status === 404) {
      return this.shifter.showPageOnly("404");
    }
    if(message) {
      return this.flash.showMessage(message, "error");
    }
    return data?.res || res;
  }
}