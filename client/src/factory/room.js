export function Room(data) {
  this._id = data._id;
  this.name = data.name;
  this.avatarUrl = data.avatarUrl;
  this.lastMessage = data.lastMessage;
  this.unReadCount = data.unReadCount;
  this.author = data.author;
  this.createdAt = data.createdAt;
  this.updatedAt = data.updatedAt;
}
