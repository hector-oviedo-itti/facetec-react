const params = new URLSearchParams(window.location.search);
const signerId = params.get("signerId");
const contractId = params.get("contractId");
const loader = document.querySelector("#fv-loader");
const error = document.querySelector("#fv-no-params-message");

if (signerId && contractId) {
  localStorage.setItem(
    "contractData",
    JSON.stringify({ signerId, contractId }),
  );
  setTimeout(() => {
    loader.style.display = "none";
    window.location.href = "./src";
  }, 2000);
} else {
  setTimeout(() => {
    loader.style.display = "none";
    error.style.display = "flex";
    window.location.href = "./src";
  }, 2000);
}