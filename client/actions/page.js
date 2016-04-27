export const SET_PAGE_ENTITY = "SET_PAGE_ENTITY";

export function setPageEntity(params) {
  return {
    type: SET_PAGE_ENTITY,
    entity: {
      ...params
    }
  }
}