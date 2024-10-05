import { getBasePath } from "./helpers.js";

export const Router ={
  adminLogin : `${getBasePath()}/admin/login/index.html`,
  adminViewAllUsers : `${getBasePath()}/admin/view-user-all/index.html`,
  adminChangeUser : `${getBasePath()}/admin/change-user/index.html`,
  adminAddUser: `${getBasePath()}/admin/add-user/index.html`,
  adminViewAllArticles: `${getBasePath()}/admin/view-articles-all/index.html`,
  

  workerLogin: `${getBasePath()}/worker/login/index.html`,
}