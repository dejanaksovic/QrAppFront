export class PageShifter {
  pages = [];
  lastShownPage;
  loader;
  constructor(ids, idToShow) {
    this.loader = document.createElement("div");
    this.loader.classList.add("loader-spinner", "hidden");
    document.body.prepend(this.loader);

    ids.forEach(id => {
      const element = document.getElementById(id);
      if(!element || !(element instanceof HTMLElement)) {
        throw Error(`Id: ${id} doesn't exist`);
      }
      // Show only the default page
      if(id !== idToShow) {
        element.classList.add("hidden");
      }else {
        this.lastShownPage = element;
      }
      this.pages.push({element, id});
    })
  }

  showPageOnly(id) {
    if(!id)
      throw new Error("Id mora biti dat")
    // Hide prev page
    if(this.lastShownPage) {
      this.lastShownPage.classList.add("hidden");
    }
    // Show the page
    const pageToShow = this.pages.find(e => e.id === id);
    if(!pageToShow.element) {
      throw Error("Page with given id not found");
    }
    pageToShow.element.classList.remove("hidden");
    this.lastShownPage = pageToShow.element;
  }

  showLoader() {
    this.lastShownPage.classList.add("hidden");
    this.loader.classList.remove("hidden");
  }
  hideLoader() {
    this.loader.classList.add("hidden");
    this.lastShownPage.classList.remove("hidden");
  }
}