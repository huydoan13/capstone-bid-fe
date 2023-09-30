// // eslint-disable-next-line import/no-unresolved
// import { HubConnectionBuilder } from "@microsoft/signalr";

// const startConnection = (updateCallback) => {
//   const connection = new HubConnectionBuilder()
//     .withUrl("https://bids-online.azurewebsites.net/sessiondetailhub")
//     .withAutomaticReconnect()
//     .build();

//   connection.on("ReceiveSessiondetailUpdate", (data) => {
//     // Call the callback function with the received data
//     updateCallback(data);
//   });

//   connection
//     .start()
//     .then(() => {
//       console.log("Connected to SignalR hub");
//     })
//     .catch((err) => console.error("Error connecting to SignalR hub:", err));

//   return connection;
// };

// export default startConnection;