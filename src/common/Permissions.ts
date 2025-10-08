/* eslint-disable import/no-unresolved */

export type PermissionMap = Record<
  string,
  { read: boolean; create: boolean; update: boolean; delete: boolean }
>;

let permissions: PermissionMap = {};

try {
  const stored = localStorage.getItem("userAccess");
  const isAdmin = localStorage.getItem("isAdmin");

  

  if (stored) {
    const parsed = JSON.parse(stored);

    if (parsed && Array.isArray(parsed.menus)) {
      permissions = parsed.menus.reduce((acc: PermissionMap, item: any) => {
        const menuName = item?.menuId?.name;
        if (menuName) {
          acc[menuName] = {
            read: !!item?.read,
            create: !!item?.create,
            update: !!item?.update,
            delete: !!item?.delete,
          };
        }
        return acc;
      }, {});
    }
  }
} catch (error) {
  console.error("Error parsing permissions from localStorage:", error);
  permissions = {};
}

export { permissions };
