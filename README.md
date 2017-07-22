# PWA-Nilish-and-Abhishek-Dutta

# How to preview the PWA on desktop?
1. Download all the files or simply clone the repository and save it in a folder called 'PWA' on your Desktop
2. Download and install Web Server for Chrome extension from https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en
3. Once done, open this application and click on 'Choose folder' option and choose the folder named 'PWA' as mentioned in step 1.
4. Make sure 'Accessible on local network' and 'Automatically show index.html' options are checked.
5. Finally, click on the toggle just below the 'Choose Folder' option to start your web server.
6. Visit the first URL in Web Server URL(s) list and it should display the application in your tab
7. Now, download the backend from https://github.com/TraineesCode/Spring-Boot-Backend-Shagil
8. Compile and run the backend
9. Our PWA is already set up to communicate with the backend. In case there is any connection/API problem, please go through capa.js and make changes to the backend URL(s) accordingly.

# How to preview the PWA on mobile?
1. Make sure your web server and backend are both running. All the devices should be connected to a common network
2. Visit the app using Chrome in your phone. 
3. Add the page to the home screen.
4. Give a suitable name, by default it would be Capability Test
5. Open the app from your homescreen and it should work fine just like the desktop version.
6. After the first usage of the app, you may also run it without the internet.
7. But the problem is, there needs to be API calls with the backend, each time you Login and proceed further. 
8. Only the App Shell has been cached using Service Workers
