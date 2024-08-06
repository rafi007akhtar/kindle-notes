# Kindle Notes

To build the notes from this app, after setting up the JSON files, run this command.

## Pre-requisites

This project is created with the Expo meta framework. So as a first step, install that, along with all the other dependencies.

```sh
npm install
```

## Create a Development Build

This will make sure you can "try-out" the app in the earliest on your smartphone, without going through complicated build processes. Keep in mind, the app will only work:

- as long as the dev server is running,
- as long as your smartphone and computer are on the same wifi network.

With that in mind, start the dev server by simply running

```sh
npm start
```

Meanwhile, install the [Expo Go app](https://expo.dev/go) on your smartphone. This will be needed for running the dev build on your smartphone.

Once the server is up, you should see a QR code in the terminal. Open the Expo Go app on Android or the Camera app on the iPhone and scan the QR code. It should then run the app on your phone.

> **Troubleshoot for iOS.** If the app does not load on an iPhone, try running the following command on Terminal and then retrying:
>
> ```sh
> npx pod-install
> ```
>
> and it _should_ then work.

## Create a Release Build

This project is can be built using either Expo's build tools or Android Studio for android apps. Here the build should will not depend on a running server or the Expo Go app, regardless of which step you are taking to build.

### Building an Android app with Android Studio

The primary benefit of this approach is that the build can be done locally, without any dependence on a third-party sevice. Furthermore, you do not need to _run_ Android Studio for this, but merely install it.

So, [install Android Studio](https://developer.android.com/studio). Once that's done, make sure there is at least one Android Virtual Device installed. If not, go ahead and [install any recent device](https://developer.android.com/studio/run/emulator#avd).

Then, you can choose between any of the following two commands.

#### Command 1

Enter the repo and run this command. If this is your first time building from this repo, only use this command, and not command 2.

```sh
npx expo run:android --variant release
```

No special configuration is needed. All the JSON files are pre-configured.

**Final product.** During and after the build, an _android_ folder will be generated in the root of the repo. The build apk will be present inside this path: `/android/app/build/outputs/apk/release/`, and it will be called _app-release.apk_.

#### Command 2

You may run this only after you have successfully run the first command at least once, and the android folder has been created.

If you do not want to run an Expo command moving forward, run this command instead.

```sh
./android/gradlew
```

This will generate the same android app that the first command would generate, in the same location.

### Building an Android App with Expo Service

The primary benefit with this approach is that you do not need to install Android Studio. In fact, this build will take place completely online, and the end-result APK will be readily available for download and install.

For this, first go to [expo.dev](https://expo.dev/), and create an account, if you don't already have one. If you already have one, then login.

Then, open [app.json](./app.json), and replace its entire contents with the following:

```json
{
  "expo": {
    "name": "Kindle Notes",
    "slug": "kindle-notes",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [["expo-document-picker"]]
  }
}
```

(Essentially, we are removing my own package and project id with yours to come.)

Next, open the terminal and run this command:

```sh
eas login
```

and login with the credentials of your Expo account you created earlier.

Once logged in, run the command to configure the build.

```sh
eas build:configure
```

This will modify the app.json file accordigly.

Finally, run this command for the build:

```sh
 eas build -p android --profile preview
```

This will upload the entire project to the EAS service and your build will be put on a queue. When your turn will come (it might take a few minutes), the build will be triggered. You can check all your projects in their online [web page](https://expo.dev/accounts/rafi007akhtar/projects). Once the build is done, you may download and install the APK.

## Build for iOS

Due to lack of build / test machines (I use Windows / Android devices), I was not able to try this out. Please refer to [this video on YouTube](https://youtu.be/cs-zgHjt5RQ?si=IAdCiruDIXE2orVm) that describes in depth how this can app can be built for iOS.
