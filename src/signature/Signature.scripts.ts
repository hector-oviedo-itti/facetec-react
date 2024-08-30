import { Config } from "../../Config";
import "pdfjs-dist";

const loader: HTMLDivElement = document.getElementById(
  "fv-loader-curtain",
) as HTMLDivElement;

const confirmButton: HTMLButtonElement = document.getElementById(
  "fv-sign-contract",
) as HTMLButtonElement;

const cancelButton: HTMLButtonElement = document.getElementById(
  "fv-cancel-sign",
) as HTMLButtonElement;

const modalError: HTMLElement = document.getElementById(
  "fv-modal-error",
) as HTMLDivElement;

const modalCancelVerification: HTMLElement = document.getElementById(
  "fv-modal-cancel-verification",
) as HTMLDivElement;

const iframePDFContainer = document.getElementById(
  "fv-pdf-container",
) as HTMLIFrameElement;

const signatureAgreement = document.getElementById(
  "fv-signature-agreement",
) as HTMLInputElement;

const flashToken = localStorage.getItem("flashUserToken");
const contractData: string = localStorage.getItem("contractData") as string;
const parsedContractData = JSON.parse(contractData);

if (confirmButton) confirmButton.disabled = true;

const displayPDF = async () => {
  loader.style.visibility = "visible";

  try {
    const result = await fetch(
      `${Config.fvBaseURL}/download/${parsedContractData.contractId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${flashToken}`,
        },
      },
    );

    const response = await result.json();

    const pdfData = atob(response.file);
    const pdfArray = new Uint8Array(pdfData.length);
    for (let i = 0; i < pdfData.length; i++) {
      pdfArray[i] = pdfData.charCodeAt(i);
    }

    const pdfBlob = new Blob([pdfArray], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.getElementById(
      "fv-pdf-container",
    ) as HTMLIFrameElement;

    if (iframe) {
      iframe.src = pdfUrl;
      // iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.right = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
    }

    loader.style.visibility = "hidden";
  } catch (err: any) {
    loader.style.visibility = "hidden";
    throw new Error(err);
  }
};

if (iframePDFContainer && signatureAgreement) {
  signatureAgreement.addEventListener("change", () => {
    if (signatureAgreement.checked) {
      confirmButton.disabled = false;
    } else {
      confirmButton.disabled = true;
    }
  });
  displayPDF();
}

confirmButton &&
  confirmButton.addEventListener("click", async () => {
    loader.style.visibility = "visible";
    cancelButton.disabled = true;

    try {
      const result = await fetch(
        `${Config.fvBaseURL}/sign/${parsedContractData.contractId}/${parsedContractData.signerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${flashToken}`,
          },
        },
      );

      if (result.ok) {
        cancelButton.disabled = false;
        loader.style.visibility = "hidden";
        window.location.href = "../success";
      } else {
        cancelButton.disabled = false;
        loader.style.visibility = "hidden";
        if (modalError) modalError.style.visibility = "visible";
      }
    } catch (err: any) {
      loader.style.visibility = "hidden";
      throw new Error(err);
    }
  });

cancelButton &&
  cancelButton.addEventListener("click", () => {
    modalCancelVerification.style.visibility = "visible";
    const okButton = document.getElementById("fv-modal-ok-cancel-button");
    const noButton = document.getElementById("fv-modal-no-cancel-button");

    noButton?.addEventListener(
      "click",
      () => (modalCancelVerification.style.visibility = "hidden"),
    );

    okButton?.addEventListener("click", () => {
      localStorage.removeItem("biometrics");
      localStorage.removeItem("contractData");
      localStorage.removeItem("flashUserToken");
      window.location.href = "/";
    });
  });
