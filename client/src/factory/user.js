export function User(data) {
  this._id = data._id;
  this.username = data.username;
  this.avatarUrl = data.avatarUrl;
  this.email = data.email;
  this.createdAt = data.createdAt;
  this.updatedAt = data.updatedAt;
}
