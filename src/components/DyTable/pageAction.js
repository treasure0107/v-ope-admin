/*
 * @Descripttion:
 * @Author: you name
 * @Date: 2021-05-11 21:29:21
 */

/**
 * 修改一页显示的数量
 * @param {integer} size 一页显示的数量
 */
export function handlePageSize(size) {
  this.pagination.size = size;
  if (this.isPagination) {
    this.fetchData();
  }
}
/**
 * 点击分页时的事件
 * @param {*} current 当前页码
 */
export function handlePageCurrent(current) {
  this.pagination.pages = current;
  console.log(this.pagination.pages);
  if (this.isPagination) {
    this.fetchData();
  }
}
