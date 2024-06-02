const eth_rpc_key = "eth_rpc";

document.addEventListener("DOMContentLoaded", function () {
  const inputBox = document.getElementById("inputBox");
  const saveButton = document.getElementById("saveButton");

  browser.storage.local.get(eth_rpc_key, (result) => {
    if (result[eth_rpc_key]) {
      inputBox.value = result[eth_rpc_key]
    }
  })

  saveButton.addEventListener("click", function () {
    try {
      new URL(inputBox.value);
    } catch (e) {
      inputBox.classList.add("invalid");
      inputBox.classList.remove("valid");
      return;
    }

    inputBox.classList.remove("invalid");
    inputBox.classList.add("valid");

    const eth_rpc_value = inputBox.value;

    browser.storage.local.set({ [eth_rpc_key]: eth_rpc_value });

    browser.runtime.sendMessage({
      action: "set " + eth_rpc_key,
      data: eth_rpc_value,
    });
  });
});
