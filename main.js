document.getElementById("tokenForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const output = document.getElementById("output");
  output.textContent = "Creating token...";
  // Aqui virá a integração com Phantom e backend
});