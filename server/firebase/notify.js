const firebase = require('./config');

async function sendNotification(deviceTokens, title, message, multi) {
  if(!multi){
    try {
      const messaging = firebase.messaging();
  
      // Construct the message payload
      const payload = {
        notification: {
          title: title,
          body: message,
        },
        android: {
          notification: {
            imageUrl: 'https://www.pngitem.com/pimgs/m/287-2876917_software-testing-hd-png-download.png'
          }
        },
        apns: {
          payload: {
            aps: {
              'mutable-content': 1
            }
          },
          fcm_options: {
            image: 'https://www.pngitem.com/pimgs/m/287-2876917_software-testing-hd-png-download.png'
          }
        },
        webpush: {
          headers: {
            image: 'https://www.pngitem.com/pimgs/m/287-2876917_software-testing-hd-png-download.png'
          }
        },
        token : deviceTokens,
      };

      // const message = {
      //   data: {
      //     score: '850',
      //     time: '2:45'
      //   },
      //   token: registrationToken
      // };

      messaging.send(payload)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    } catch (error) {
      console.error('Error sending notification:', error);
      return false; // Notification sending failed
    }
  }else{
    try {
      const messaging = firebase.messaging();
  
      // Construct the message payload
      const payload = {
        notification: {
          title: title,
          body: message,
        },
        android: {
          notification: {
            imageUrl: 'https://www.pngitem.com/pimgs/m/287-2876917_software-testing-hd-png-download.png'
          }
        },
        apns: {
          payload: {
            aps: {
              'mutable-content': 1
            }
          },
          fcm_options: {
            image: 'https://www.pngitem.com/pimgs/m/287-2876917_software-testing-hd-png-download.png'
          }
        },
        webpush: {
          headers: {
            image: 'https://www.pngitem.com/pimgs/m/287-2876917_software-testing-hd-png-download.png'
          }
        },
        tokens : deviceTokens,
      };

      // const message = {
      //   data: {
      //     score: '850',
      //     time: '2:45'
      //   },
      //   token: registrationToken
      // };

      messaging.sendMulticast(payload)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    } catch (error) {
      console.error('Error sending notification:', error);
      return false; // Notification sending failed
    }
  }
  }
  module.exports = sendNotification;