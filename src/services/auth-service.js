// import ConnectyCube from "connectycube";
import { credentials, appConfig } from "../config";
import ConnectyCube from 'connectycube';

export default class AuthService {
//   $loginScreen = document.getElementById("login");
//   $callScreen = document.getElementById("call");
//   $loader = document.getElementById("login-loader");
//   $caption = document.getElementById("login-caption");

  init = () => ConnectyCube.init(credentials, appConfig);

  login = user => {
    return new Promise((resolve, reject) => {
      // ConnectyCube.createSession(user)
      //   .then(() => ConnectyCube.chat.connect({ userId: user.login, password: user.password }))
      //   .then(() => {
      //     resolve();
      //   })
      //   .catch(reject);
      ConnectyCube.createSession(user, (error, session) => {
        if (session && !error) {
          ConnectyCube.chat.connect({ userId: session.user_id, password: user.password }, (error, session) => {
            if(session && !error) {
              resolve()
            }
            else {
              reject()
            }
          })
        } else {
          reject()
        }
      });
    });
  };

  logout = () => {
    ConnectyCube.chat.disconnect();
    ConnectyCube.destroySession();

    // this.$callScreen.classList.add("hidden");
    // this.$loginScreen.classList.remove("hidden");
  };
}