import { FlashMessage } from "./Flash.js";
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
    if(!successRedirect)
      throw Error("Success redirect must be given")
    // Checks pass
    this.role = role;
    this.shifter = shifter;
    this.successRedirect = successRedirect;
    // flash message
    this.flash = new FlashMessage();
  }

  async doRequest(options, successMessage) {
    const { url, method, password, body } = options;
    if(!url)
      throw Error("Url must be given");
    if(!method)
      throw Error("Method must be given");
    let res, data;
    try {
      res = await fetch(url, {
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
      console.log(err);
      return this.shifter.showPageOnly("500");
    }

    const message = data?.message;

    if(res.ok) {
      if(successMessage) {
        this.flash.leaveMessage(successMessage, "success");
        return window.location.assign(this.successRedirect);
      }      
    }
    if(res.status === 500) {
      return this.shifter.showPageOnly("500");
    }
    if(res.status === 401 || res.status === 403) {
      switch(role) {
        case "admin": {
          return window.location.assign(Router.adminLogin);
        }
        case "worker": {
          return window.location.assign(Router.workerLogin);
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

    return data;
  }
}