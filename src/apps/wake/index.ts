/////////////////////////////// cubething.dev /////////////////////////////////

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const params = new URLSearchParams(window.location.search);
const pw = params.get("pw");

document.getElementsByTagName("html")[0]!.style.removeProperty("display");

document.body.innerHTML = `
  
  <style>
    button {
      border: 1px solid;
      border-radius: 0.25em;
      padding: 0.5em 1em;
      line-height: 1em;
    }
    .dark button:hover {
      color: var(--dark-accent)
    }
    button:hover {
      color: var(--accent) 
    }
    pre {
      height: 20em;
      overflow: scroll;
    }
  </style>
  
  <img id="status-img"></img>
  <pre><code id="status"></code></pre>
  <div>
      <button id="poll">poll</button>
      <button id="wake">wake up!</button>
      <div id="result"></div>
  <div>
`;

const statusEl = document.getElementById("status")!;
const statusImg = document.getElementById("status-img")! as HTMLImageElement;
const wakeBtn = document.getElementById("wake")! as HTMLButtonElement;
const pollBtn = document.getElementById("poll")! as HTMLButtonElement;
const resultDiv = document.getElementById("result")! as HTMLDivElement;

const getStatus = () => {
  statusEl.innerText = "polling...";
  statusImg.src = "/static/media/wake/wait.gif";
  fetch(`/wake/status?pw=${pw}`, { redirect: "follow", cache: "no-cache" })
    .then(async (res) => {
      const json = await res.json();
      if (json.online) {
        statusImg.src = "/static/media/wake/awake.gif";
      } else {
        statusImg.src = "/static/media/wake/asleep.gif";
      }
      statusEl.innerText = JSON.stringify(json, undefined, 2);
    })
    .catch((e) => {
      statusEl.innerText = e;
      statusImg.src = "/static/media/wake/failure.gif";
    });
};

wakeBtn.onclick = () => {
  fetch(`/wake/send?pw=${pw}`, { redirect: "follow" })
    .then(async (res) => {
      resultDiv.innerText = await res.text();
      getStatus();
    })
    .catch((e) => {
      resultDiv.innerText = e;
    });
};

pollBtn.onclick = getStatus;

getStatus();
