import { getBasePath } from "./helpers";

export const Router ={
  adminLogin : `${getBasePath()}/admin/login/index.html`,
  adminViewAllUsers : `${getBasePath()}/admin/view-user-all/index.html`,
  adminChangeUser : `${getBasePath()}/admin/change-user/index.html`,
  adminAdd: `${getBasePath()}/admin/add-user/index.html`,

  workerLogin: `${getBasePath()}/worker/login/index.html`,
}