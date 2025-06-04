let connectedWallet = null;

window.addEventListener("load", async () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      try {
        const resp = await provider.connect({ onlyIfTrusted: true });
        connectedWallet = resp.publicKey.toString();
        window.connectedWallet = connectedWallet;
        document.getElementById("connectBtn").textContent = "Connected ✅";
        document.getElementById("walletAddress").textContent = `Connected: ${connectedWallet}`;
      } catch (err) {
        console.warn("Phantom not connected yet.");
      }
    }
  }
});

document.getElementById("connectBtn").addEventListener("click", async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      connectedWallet = resp.publicKey.toString();
      window.connectedWallet = connectedWallet;
      document.getElementById("connectBtn").textContent = "Connected ✅";
      document.getElementById("walletAddress").textContent = `Connected: ${connectedWallet}`;
    } catch (err) {
      console.error("User rejected connection.");
    }
  } else {
    alert("Please install Phantom Wallet.");
  }
});

document.getElementById("customCreator").addEventListener("change", function () {
  document.getElementById("creatorAddress").disabled = !this.checked;
});

document.getElementById("tokenForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const output = document.getElementById("output");
  output.textContent = "Creating token...";

  const name = document.getElementById("tokenName").value.trim();
  const symbol = document.getElementById("tokenSymbol").value.trim();
  const supply = parseInt(document.getElementById("supply").value.trim());
  const decimals = parseInt(document.getElementById("decimals").value.trim());
  const creatorAddress = document.getElementById("customCreator").checked
    ? document.getElementById("creatorAddress").value.trim()
    : window.connectedWallet || "";

  if (!window.connectedWallet) {
    output.textContent = "Please connect Phantom wallet first.";
    return;
  }

  try {
    const res = await fetch("http://173.249.40.169:10000/create-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        symbol,
        supply,
        decimals,
        creator: creatorAddress
      })
    });

    const data = await res.json();
    if (res.ok && data.token_address) {
      output.innerHTML = `✅ Token created: <code>${data.token_address}</code> <button onclick="copyToken('${data.token_address}')">📋 Copy</button>`;
    } else {
      output.textContent = "Error: " + (data.error || "Unknown error.");
    }
  } catch (err) {
    console.error(err);
    output.textContent = "Error connecting to backend.";
  }
});

function copyToken(address) {
  navigator.clipboard.writeText(address).then(() => {
    alert("Token address copied!");
  });
}
