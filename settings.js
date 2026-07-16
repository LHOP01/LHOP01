import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQ5CO4sLv_8j22N0YJyQmz8hIZpMs6DhE",
  authDomain: "lhop01-admin.firebaseapp.com",
  databaseURL: "https://lhop01-admin-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lhop01-admin",
  storageBucket: "lhop01-admin.firebasestorage.app",
  messagingSenderId: "382345315199",
  appId: "1:382345315199:web:fafa4d6ee8d82e1d97104a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Save Settings
window.saveSettings = function () {

  const panelName = document.getElementById("panelName").value;
  const announcement = document.getElementById("announcement").value;
  const maintenance = document.getElementById("maintenance").checked;
  
  set(ref(db, "settings"), {
    panelName: panelName,
    announcement: announcement
    maintenance: maintenance
  });

  alert("Settings Saved Successfully");
};

// Load Settings
onValue(ref(db, "settings"), (snapshot) => {

  const data = snapshot.val();

  if (data) {

    document.getElementById("panelName").value = data.panelName || "";
    document.getElementById("announcement").value = data.announcement || "";
    document.getElementById("maintenance").checked = data.maintenance || false;
    
  }

});
