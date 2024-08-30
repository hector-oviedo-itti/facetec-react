// UI Convenience Functions
export var SampleAppUIFunctions = function (elementString: string): any {
  // Get the element(s) for ui operations from the elementString;
  const currentElements: NodeListOf<Element> | [Element] =
    document.querySelectorAll(elementString);

  // Save the original display property of the element before hiding it
  const saveDisplayForElement = function (el: HTMLElement): void {
    var display = window.getComputedStyle(el).display;

    if (typeof display !== "undefined" && display !== "none") {
      el.setAttribute("displaytype", display);
    }
  };

  // Set the display of the element to either block or restore it's original value
  const setDisplayForElement = function (el: HTMLElement): void {
    var display = "block";

    if (el.getAttribute("displaytype") !== null) {
      display = el.getAttribute("displaytype")!;
    }

    el.style.display = display;
  };

  // Fade in the element to opacity over duration ms with an optional callback
  const fadeIn = function (
    el: HTMLElement,
    opacity?: string,
    duration?: number,
    callback?: () => void,
  ): void {
    if (!el) {
      return;
    }

    opacity = opacity || "1";
    duration = duration || 1;
    var computedStyle = window.getComputedStyle(el);

    if (computedStyle.display === "none" && computedStyle.opacity === "1") {
      el.style.opacity = "0";
    }

    el.style.visibility = "visible";
    saveDisplayForElement(el);
    setDisplayForElement(el);
    // @ts-ignore
    el.style["-webkit-transition"] = "opacity " + duration + "ms";
    // @ts-ignore
    el.style["-moz-transition"] = "opacity " + duration + "ms";
    // @ts-ignore
    el.style["-o-transition"] = "opacity " + duration + "ms";
    el.style.transition = "opacity " + duration + "ms";
    // Allow JS to clear execution stack
    window.setTimeout(function () {
      requestAnimationFrame(function () {
        el.style.opacity = opacity!;
      });
    });
    window.setTimeout(function () {
      setDisplayForElement(el);

      if (callback != null) {
        callback();
      }
    }, duration);
  };

  // Fade out the element to opacity over duration ms with an optional callback
  const fadeOut = function (
    el: HTMLElement,
    opacity?: string,
    duration?: number,
    callback?: () => void,
  ): void {
    if (!el) {
      return;
    }

    saveDisplayForElement(el);
    opacity = opacity || "0";
    duration = duration || 1;
    // @ts-ignore
    el.style["-webkit-transition"] = "opacity " + duration + "ms";
    // @ts-ignore
    el.style["-moz-transition"] = "opacity " + duration + "ms";
    // @ts-ignore
    el.style["-o-transition"] = "opacity " + duration + "ms";
    el.style.transition = "opacity " + duration + "ms";
    // Allow JS to clear execution stack
    window.setTimeout(function () {
      requestAnimationFrame(function () {
        el.style.opacity = opacity!;
      });
    });
    window.setTimeout(function () {
      el.style.display = "none";

      if (callback != null) {
        callback();
      }
    }, duration);
  };

  return {
    fadeOut: function (duration?: any, callback?: any): void {
      currentElements.forEach(function (element: Element) {
        fadeOut(element as HTMLElement, "0", duration, callback);
      });
    },
    fadeIn: function (duration?: any, callback?: any): void {
      currentElements.forEach(function (element: Element) {
        fadeIn(element as HTMLElement, "1", duration, callback);
      });
    },
    show: function (): void {
      currentElements.forEach(function (element: Element) {
        (element as HTMLElement).style.opacity = "1";
        setDisplayForElement(element as HTMLElement);
      });
    },
    hide: function (): void {
      currentElements.forEach(function (element: Element) {
        (element as HTMLElement).style.opacity = "0";
        setDisplayForElement(element as HTMLElement);
      });
    },
    scrollTop: function (value: number): void {
      currentElements.forEach(function (element: Element) {
        (element as HTMLElement).scrollTop = value;
      });
    },
    css: function (styleProperTies: any): void {
      if (typeof styleProperTies !== "object") {
        throw new Error("UI.css must be called with an object");
        return;
      }

      currentElements.forEach(function (element: Element) {
        Object.keys(styleProperTies).forEach(function (style: string) {
          // @ts-ignore
          (element as HTMLElement).style[style] = styleProperTies[style];
        });
      });
    },
  };
};
