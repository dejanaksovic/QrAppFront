export class PageShifter {
  pages = [];
  lastShownPage;
  constructor(ids, idToShow) {
    ids.forEach(id => {
      const element = document.getElementById(id);
      if(!element || !(element instanceof HTMLElement)) {
        throw Error("Uneti id ne postoji");
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
    console.log(typeof(pageToShow));
    if(!pageToShow) {
      throw Error("Page with given id not found");
    }
    pageToShow.element.classList.remove("hidden");
  }
}