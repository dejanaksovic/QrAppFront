import { getBasePath } from "./helpers.js";

const basePath = getBasePath();

export const Router ={
  adminLogin : `${basePath}/admin/login/index.html`,
  adminViewAllUsers : `${basePath}/admin/view-user-all/index.html`,
  adminChangeUser : `${basePath}/admin/change-user/index.html`,
  adminAddUser: `${basePath}/admin/add-user/index.html`,
  adminViewAllArticles: `${basePath}/admin/view-articles-all/index.html`,
  adminAddArticle: `${basePath}/admin/add-article/index.html`,
  adminChangeArticle: `${basePath}/admin/change-article/index.html`,

  workerLogin: `${basePath}/worker/login/index.html`,
}