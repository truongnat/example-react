export function Todo(data) {
  this._id = data._id;
  this.title = data.title;
  this.content = data.content;
  this.status = data.status;
  this.userId = data.userId;
  this.createdAt = data.createdAt;
  this.updatedAt = data.updatedAt;
}
