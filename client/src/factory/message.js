export function Message(data) {
  this._id = data._id;
  this.room = data.room;
  this.author = data.author;
  this.content = data.content;
  this.status = data.status;
  this.createdAt = data.createdAt;
  this.updatedAt = data.updatedAt;
}
