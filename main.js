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
    : window.connectedWallet || ""; // fallback

  if (!window.connectedWallet) {
    output.textContent = "Please connect Phantom wallet first.";
    return;
  }

  try {
    const res = await fetch("https://spraynest-backend.onrender.com/create-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        symbol,
        supply,
        decimals,
        creator: creatorAddress || window.connectedWallet
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

function copyToken(token) {
  navigator.clipboard.writeText(token);
}
