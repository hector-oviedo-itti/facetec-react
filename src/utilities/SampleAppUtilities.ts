import { Config } from "../../Config";
import { FaceTecSDK } from "../../core-sdk/FaceTecSDK.js/FaceTecSDK";
import { SampleAppUIFunctions } from "./SampleAppUIFunctions";
import {
  FaceTecIDScanResult,
  FaceTecSessionResult,
} from "../../core-sdk/FaceTecSDK.js/FaceTecPublicApi";
import { SoundFileUtilities } from "./SoundFileUtilities";
import { DeveloperStatusMessages } from "./DeveloperStatusMessages";
const ocrLocalizationJSON = require("../../sample-app-resources/FaceTec_OCR_Customization.json");

export var SampleAppUtilities = (function (): any {
  var vocalGuidanceSoundFilesDirectory =
    "../../sample-app-resources/Vocal_Guidance_Audio_Files/";

  enum VocalGuidanceMode {
    MINIMAL,
    FULL,
    OFF,
  }

  var vocalGuidanceOnPlayer = new Audio(
    vocalGuidanceSoundFilesDirectory + "vocal_guidance_on.mp3",
  );
  var vocalGuidanceOffPlayer = new Audio(
    vocalGuidanceSoundFilesDirectory + "vocal_guidance_off.mp3",
  );
  vocalGuidanceOnPlayer.volume = 0.4;
  vocalGuidanceOffPlayer.volume = 0.4;

  vocalGuidanceOffPlayer.onended = function (): void {
    enableVocalGuidanceButtons();
  };

  vocalGuidanceOnPlayer.onended = function (): void {
    enableVocalGuidanceButtons();
  };

  var vocalGuidanceMode: VocalGuidanceMode = VocalGuidanceMode.MINIMAL;

  function setVocalGuidanceMode(): void {
    disableVocalGuidanceButtons();

    if (!vocalGuidanceOnPlayer.paused || !vocalGuidanceOffPlayer.paused) {
      return;
    }

    let playPromise: Promise<void>;

    switch (vocalGuidanceMode) {
      case VocalGuidanceMode.OFF:
        vocalGuidanceMode = VocalGuidanceMode.MINIMAL;

        (
          document.getElementById("vocal-guidance-icon-minimal") as HTMLElement
        ).style.display = "block";
        (
          document.getElementById("vocal-guidance-icon-full") as HTMLElement
        ).style.display = "none";
        (
          document.getElementById("vocal-guidance-icon-off") as HTMLElement
        ).style.display = "none";

        playPromise = vocalGuidanceOnPlayer.play();

        if (typeof playPromise !== "undefined") {
          playPromise.catch((_event: void): void => {
            // Play failed
          });
        }

        Config.currentCustomization.vocalGuidanceCustomization.mode =
          VocalGuidanceMode.MINIMAL;
        break;

      case VocalGuidanceMode.MINIMAL:
        vocalGuidanceMode = VocalGuidanceMode.FULL;

        (
          document.getElementById("vocal-guidance-icon-minimal") as HTMLElement
        ).style.display = "none";
        (
          document.getElementById("vocal-guidance-icon-full") as HTMLElement
        ).style.display = "block";
        (
          document.getElementById("vocal-guidance-icon-off") as HTMLElement
        ).style.display = "none";

        playPromise = vocalGuidanceOnPlayer.play();

        if (typeof playPromise !== "undefined") {
          playPromise.catch((_event: void): void => {
            // Play failed
          });
        }

        Config.currentCustomization.vocalGuidanceCustomization.mode =
          VocalGuidanceMode.FULL;
        break;

      case VocalGuidanceMode.FULL:
        vocalGuidanceMode = VocalGuidanceMode.OFF;

        (
          document.getElementById("vocal-guidance-icon-minimal") as HTMLElement
        ).style.display = "none";
        (
          document.getElementById("vocal-guidance-icon-full") as HTMLElement
        ).style.display = "none";
        (
          document.getElementById("vocal-guidance-icon-off") as HTMLElement
        ).style.display = "block";

        playPromise = vocalGuidanceOffPlayer.play();

        if (typeof playPromise !== "undefined") {
          playPromise.catch((_event: void): void => {
            // Play failed
          });
        }

        Config.currentCustomization.vocalGuidanceCustomization.mode =
          VocalGuidanceMode.OFF;
        break;
    }

    FaceTecSDK.setCustomization(Config.currentCustomization);
  }

  function setVocalGuidanceSoundFiles(): void {
    var soundFileUtilities = new SoundFileUtilities();
    Config.currentCustomization = soundFileUtilities.setVocalGuidanceSoundFiles(
      Config.currentCustomization,
    );
    FaceTecSDK.setCustomization(Config.currentCustomization);
  }

  function setOCRLocalization(): void {
    // Set the strings to be used for group names, field names, and placeholder texts for the FaceTec ID Scan User OCR Confirmation Screen.
    // DEVELOPER NOTE: For this demo, we are using the template json file, 'FaceTec_OCR_Customization.json,' as the parameter in calling teh configureOCRLocalization API.
    // For the configureOCRLocalization API parameter, you may use any object that follows the same structure and key naming as the template json file, 'FaceTec_OCR_Customization.json'.
    FaceTecSDK.configureOCRLocalization(ocrLocalizationJSON);
  }

  function fadeInMainUIContainer(): void {
    SampleAppUIFunctions(".loading-session-token-container").fadeOut(1);
    SampleAppUIFunctions("#theme-transition-overlay").fadeOut(800);
    SampleAppUIFunctions(".wrapping-box-container").fadeIn(800);
    SampleAppUIFunctions("footer").fadeIn(800);
  }

  function fadeInMainUIControls(callback?: () => void): void {
    if (isLikelyMobileDevice()) {
      SampleAppUIFunctions("#custom-logo-container").fadeIn(800);
      SampleAppUIFunctions("#vocal-icon-container").fadeIn(800);
    }

    SampleAppUIFunctions("footer").fadeIn(800);
    SampleAppUIFunctions("#controls").fadeIn(800, () => {
      enableControlButtons();
      enableVocalGuidanceButtons();

      if (typeof callback !== "undefined") {
        callback();
      }
    });
  }

  // Disable buttons to prevent hammering, fade out main interface elements, and reset the Session Review Screen data.
  function fadeOutMainUIAndPrepareForSession(): void {
    disableControlButtons();

    if (isLikelyMobileDevice()) {
      SampleAppUIFunctions("#custom-logo-container").fadeOut(800);
      SampleAppUIFunctions("#vocal-icon-container").fadeOut(800);

      disableVocalGuidanceButtons();
    }

    SampleAppUIFunctions("footer").fadeOut(800);
    SampleAppUIFunctions("#controls").fadeOut(800);
    SampleAppUIFunctions(".wrapping-box-container").fadeOut(800);
    SampleAppUIFunctions("#theme-transition-overlay").fadeIn(800);
  }

  function showLoadingSessionToken(): void {
    SampleAppUIFunctions(".loading-session-token-container").fadeIn(300);
  }

  function hideLoadingSessionToken(): void {
    SampleAppUIFunctions(".loading-session-token-container").fadeOut(800);
  }

  function disableControlButtons(): void {
    document.querySelectorAll("#controls > button").forEach(function (
      button: Element,
    ) {
      button.setAttribute("disabled", "true");
    });
  }

  function enableControlButtons(): void {
    document.querySelectorAll("#controls > button").forEach(function (
      button: Element,
    ) {
      button.removeAttribute("disabled");
    });

    document.querySelectorAll(".vocal-icon").forEach(function (icon: Element) {
      icon.removeAttribute("disabled");
    });
  }

  function showMainUI(): void {
    fadeInMainUIContainer();
    fadeInMainUIControls();
  }

  function handleErrorGettingServerSessionToken(): void {
    showMainUI();
    DeveloperStatusMessages.logAndDisplayMessage(
      "Session could not be started due to an unexpected issue during the network request.",
    );
  }

  function generateUUId(): string {
    // @ts-ignore
    return ("" + [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
      /[018]/g,
      (c: any) => {
        return (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16);
      },
    );
  }

  function formatUIForDevice(): void {
    window.addEventListener("keydown", onKeyDown);

    if (isLikelyMobileDevice()) {
      var windowWidth = window.innerWidth;

      // Adjust button sizing
      document.querySelectorAll("button").forEach(function (
        element: HTMLButtonElement,
      ) {
        if (element.className === "big-button") {
          (element as HTMLElement).style.height = "40px";

          if (windowWidth <= 320) {
            (element as HTMLElement).style.fontSize = "16px";
          } else {
            (element as HTMLElement).style.fontSize = "18px";
          }
        } else if (element.className === "medium-button") {
          (element as HTMLElement).style.height = "30px";
          (element as HTMLElement).style.fontSize = "14px";
        }

        // (element as HTMLElement).style.width = "60%";
      });
      // Adjust main interface display
      (document.getElementById("main-interface") as HTMLElement).style.display =
        "contents";
      (
        document.getElementById("main-interface") as HTMLElement
      ).style.backgroundColor = "transparent";
      (
        document.getElementById("main-interface") as HTMLElement
      ).style.borderColor = "transparent";
      (document.getElementById("main-interface") as HTMLElement).style.width =
        "unset";

      // Hide border around control panel and adjust height
      (document.getElementById("controls") as HTMLElement).style.height =
        "auto";
      (
        document.getElementById("controls") as HTMLElement
      ).style.backgroundColor = "transparent";
      // Hide status label text background and decrease label font size
      (document.getElementById("status") as HTMLElement).style.backgroundColor =
        "transparent";
      (document.getElementById("status") as HTMLElement).style.fontSize =
        "12px";
      (document.getElementById("status") as HTMLElement).style.position =
        "inherit";
      (document.getElementById("status") as HTMLElement).style.width = "90%";
      (document.getElementById("status") as HTMLElement).style.margin =
        "0 auto";
      (document.getElementById("status") as HTMLElement).style.bottom = "unset";
      // Move and update vocal guidance icon
      (document.getElementById(
        "vocal-icon-container",
      ) as HTMLElement)!.parentNode!.parentNode!.parentNode!.parentNode!.insertBefore(
        document.getElementById("vocal-icon-container")!,
        (document.getElementById("vocal-icon-container") as HTMLElement)!
          .parentNode!.parentNode!.parentNode!.parentNode!.firstChild,
      );
      document.querySelectorAll(".vocal-icon").forEach(function (
        icon: Element,
      ) {
        (<HTMLElement>icon).style.height = "30px";
        (<HTMLElement>icon).style.margin = "20px";
        (<HTMLElement>icon).style.transform = "translate(180px, 50px)";
      });
      // Move logo above buttons
      (document.getElementById(
        "custom-logo-container",
      ) as HTMLElement)!.parentNode!.insertBefore(
        document.getElementById("custom-logo-container")!,
        document.getElementById("custom-logo-container")!.parentNode!
          .firstChild,
      );
      (document.getElementById(
        "custom-logo-container",
      ) as HTMLElement)!.style.margin = "0px 0px 20px 0px";
      (
        document.querySelector("#custom-logo-container img") as HTMLElement
      ).style.height = "40px";
      // Center control interface on screen
      /* (
        document.getElementsByClassName(
          "wrapping-box-container",
        )[0] as HTMLElement
      ).style.top = "50%";
      (
        document.getElementsByClassName(
          "wrapping-box-container",
        )[0] as HTMLElement
      ).style.left = "50%";
      (
        document.getElementsByClassName(
          "wrapping-box-container",
        )[0] as HTMLElement
      ).style.transform = "translate(-50%, -50%)"; */
      // Adjust button margins
      /* (
        document.getElementById("liveness-button") as HTMLElement
      ).style.marginTop = "unset"; */
      /* (
        document.getElementById("design-showcase-button") as HTMLElement
      ).style.marginBottom = "unset"; */
      // Setup footer sizing
      var footerFontSize = "100%";

      if (windowWidth < 768) {
        footerFontSize = "9px";
      }

      if (windowWidth < 415) {
        footerFontSize = "8px";
      }

      if (windowWidth <= 360) {
        footerFontSize = "7px";
      }

      SampleAppUIFunctions("footer").css({
        "font-size": footerFontSize,
        "line-height": "9px",
      });
      SampleAppUIFunctions("footer span p").css({ "font-size": "inherit" });
      SampleAppUIFunctions("footer span, footer span p").css({ margin: 0 });
      /* (document.querySelector("hr") as HTMLElement).classList.remove(
        "display-none",
      ); */
      /* var computedFooterFontSize = window.getComputedStyle(
        document.querySelector("footer span p") as HTMLElement,
      ).fontSize;
      SampleAppUIFunctions("#copy-right-length").css({
        "font-size": computedFooterFontSize,
      }); */
      var copyRightStringLength = (
        document.getElementById("copy-right-length") as HTMLElement
      ).clientWidth;
      SampleAppUIFunctions("hr").css({ width: copyRightStringLength + "px" });

      // Allow time for the UI to fully load before fading in the body
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          displayElementsAfterStyling();
        });
      });
    } else {
      displayElementsAfterStyling();
    }
  }

  var keyboardAccessibilityStylingOn = false;

  function onKeyDown(e: KeyboardEvent): void {
    if (e.key === "Tab") {
      enableKeyboardAccessibilityStyling(true);
    }
  }

  function enableKeyboardAccessibilityStyling(enable: boolean): void {
    // Mobile not supported
    if (isLikelyMobileDevice() || keyboardAccessibilityStylingOn) {
      return;
    }

    keyboardAccessibilityStylingOn = true;

    const buttons = document.getElementsByClassName("ft-button");

    for (var i = 0; i < buttons.length; i++) {
      const element: HTMLElement = buttons[i] as HTMLElement;

      if (enable) {
        element.style.outline = "revert";
      } else {
        element.style.outline = "none";
      }
    }
  }

  function displayElementsAfterStyling(): void {
    document.querySelectorAll("button").forEach(function (
      element: HTMLButtonElement,
    ) {
      element.classList.add("button-transitions");
    });
    SampleAppUIFunctions("body").fadeIn(800);
  }

  function disableVocalGuidanceButtons(): void {
    document.querySelectorAll(".vocal-icon").forEach((button: Element) => {
      (<HTMLButtonElement>button).setAttribute("disabled", "true");
    });
  }

  function enableVocalGuidanceButtons(): void {
    document.querySelectorAll(".vocal-icon").forEach((button: Element) => {
      (<HTMLButtonElement>button).removeAttribute("disabled");
    });
  }

  function isLikelyMobileDevice(): boolean {
    var isMobileDeviceUA =
      !!/Android|iPhone|iPad|iPod|IEMobile|Mobile|mobile/i.test(
        navigator.userAgent || "",
      );

    // ChromeOS/Chromebook detection.
    if (
      isMobileDeviceUA &&
      (navigator.userAgent.indexOf("CrOS") !== -1 ||
        navigator.userAgent.indexOf("Chromebook") !== -1)
    ) {
      isMobileDeviceUA = false;
    }

    // Mobile device determination based on portrait / landscape and user agent.
    if (screen.width < screen.height || isMobileDeviceUA) {
      // Assume mobile device when in portrait mode or when determined by the user agent.
      return true;
    } else {
      return false;
    }
  }

  function disableAllButtons(): void {
    (document.getElementById("enroll-button") as HTMLElement).setAttribute(
      "disabled",
      "true",
    );
    (document.getElementById("id-scan-button") as HTMLElement).setAttribute(
      "disabled",
      "true",
    );
    (
      document.getElementById("photo-id-scan-button") as HTMLElement
    ).setAttribute("disabled", "true");
    /* (document.getElementById("liveness-button") as HTMLElement).setAttribute(
      "disabled",
      "true",
    ); */
    (
      document.getElementById("authenticate-button") as HTMLElement
    ).setAttribute("disabled", "true");
    (document.getElementById("audit-trail-button") as HTMLElement).setAttribute(
      "disabled",
      "true",
    );
    /* (
      document.getElementById("design-showcase-button") as HTMLElement
    ).setAttribute("disabled", "true"); */
  }

  function enableAllButtons(): void {
    (document.getElementById("enroll-button") as HTMLElement).removeAttribute(
      "disabled",
    );
    (document.getElementById("id-scan-button") as HTMLElement).removeAttribute(
      "disabled",
    );
    (
      document.getElementById("photo-id-scan-button") as HTMLElement
    ).removeAttribute("disabled");
    /* (document.getElementById("liveness-button") as HTMLElement).removeAttribute(
      "disabled",
    ); */
    (
      document.getElementById("authenticate-button") as HTMLElement
    ).removeAttribute("disabled");
    (
      document.getElementById("audit-trail-button") as HTMLElement
    ).removeAttribute("disabled");
    /* (
      document.getElementById("design-showcase-button") as HTMLElement
    ).removeAttribute("disabled"); */
  }

  function fadeInBlurOverlay(): void {
    (document.getElementById("controls") as HTMLElement).classList.add(
      "blur-content",
    );
  }

  function fadeOutBlurOverlay(): void {
    if (
      (document.getElementById("controls") as HTMLElement).classList.contains(
        "blur-content",
      )
    ) {
      (document.getElementById("controls") as HTMLElement).classList.remove(
        "blur-content",
      );
    }
  }

  function showAuditTrailImages(
    sessionResult: FaceTecSessionResult | null,
    idScanResult: FaceTecIDScanResult | null,
  ): void {
    var auditTrailImages: string[] = [];

    // Add available audit trail images.
    if (
      sessionResult != null &&
      sessionResult.auditTrail != null &&
      sessionResult.auditTrail.length > 0
    ) {
      // Add the regular audit trail images
      sessionResult.auditTrail.forEach(function (image: String) {
        auditTrailImages.push("data:image/jpeg;base64," + image);
      });
    }

    if (
      idScanResult != null &&
      idScanResult.frontImages != null &&
      idScanResult.frontImages.length > 0
    ) {
      // Add ID Scan Front images
      auditTrailImages.unshift(
        "data:image/jpeg;base64," + idScanResult.frontImages[0],
      );
    }

    if (
      idScanResult != null &&
      idScanResult.backImages != null &&
      idScanResult.backImages.length > 0
    ) {
      // Add ID Scan Back images
      auditTrailImages.unshift(
        "data:image/jpeg;base64," + idScanResult.backImages[0],
      );
    }

    if (auditTrailImages.length > 0) {
      disableAllButtons();
      fadeInBlurOverlay();

      auditTrailImages.forEach(function (img: string) {
        addDismissibleImagePopUp(img);
      });
    } else {
      DeveloperStatusMessages.logAndDisplayMessage("No Audit Trail Images");
    }
  }

  function addDismissibleImagePopUp(img: string): void {
    var auditTrailOverlay = document.createElement("div");
    var auditTrailImage = new Image();
    auditTrailImage.src = img;
    auditTrailImage.classList.add("audit-trail-image");
    auditTrailOverlay.classList.add("audit-trail-overlay");

    auditTrailOverlay.onclick = function (): void {
      if (document.querySelectorAll(".audit-trail-overlay").length === 1) {
        fadeOutBlurOverlay();
        auditTrailOverlay.style.transition = "0.3s";
        auditTrailOverlay.style.opacity = "0";
        var _this = this;

        setTimeout(function () {
          enableAllButtons();
          (_this as HTMLElement).remove();
        }, 500);
      } else {
        (this as HTMLElement).remove();
      }
    };

    auditTrailOverlay.append(auditTrailImage);
    (document.getElementById("controls") as HTMLElement).append(
      auditTrailOverlay,
    );
  }

  return {
    setVocalGuidanceSoundFiles,
    setVocalGuidanceMode,
    setOCRLocalization,
    fadeInMainUIContainer,
    fadeInMainUIControls,
    fadeOutMainUIAndPrepareForSession,
    disableControlButtons,
    enableControlButtons,
    generateUUId,
    formatUIForDevice,
    showMainUI,
    hideLoadingSessionToken,
    showLoadingSessionToken,
    isLikelyMobileDevice,
    UI: SampleAppUIFunctions,
    showAuditTrailImages,
    handleErrorGettingServerSessionToken,
  };
})();
