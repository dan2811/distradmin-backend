
# Distractions Backend

Strapi is used as the foundation for this project. The purpose of this project is to provide a unified backend for the two main distractions applications to use. The strapi UI is to be used by devs only for a small number of one-time tasks, giving us an extra layer of protection against malicuous/accidental data deletion. Admins should complete their daily work using the [admin console](https://github.com/dan2811/distradmin-frontend).

## 🚀 Socket.io Integration

This backend service allows a client to create a websocket connection, this is to allow for instant messaging between users.

### Backend Listens For:

| Event Type | Inputs | Description |
| :--------- | :----- | :---------- |
| connection | none | This allows for the initial connection between client and backend |
| join | user, roomId | Joins the client to the requested roomId (Rooms are named by prefixing the roomId with "room-") |
| clientMessage | user, message, roomId | Allows for a message to be created in the DB and saved to the correct chat |
| messageRead | userId, messageId | Marks that the user has read the message, by adding the userId to an array called 'hasRead' held on the message |

### Backend Emits:

| Event Type | Outputs | Description |
| :--------- | :------ | :---------- |
| newMessage | newMessage | Notifies any clients currently connected to the room that there is a new message |
