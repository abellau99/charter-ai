/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

// TODO1: Import Base64-encoded string for image.
import { base64Image } from "../../base64Image";

Office.onReady((info) => {
  if (info.host === Office.HostType.PowerPoint) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    // TODO2: Assign event handler for insert-image button.
    document.getElementById("insert-image").onclick = () => clearMessage(insertImage);
    // TODO4: Assign event handler for insert-text button.
    document.getElementById("insert-text").onclick = () => clearMessage(insertText);
    // TODO6: Assign event handler for get-slide-metadata button.
    document.getElementById("get-slide-metadata").onclick = () => clearMessage(getSlideMetadata);
    // TODO8: Assign event handlers for add-slides and the four navigation buttons.
  }
});


function insertImage() {
  // Call Office.js to insert the image into the document.
  Office.context.document.setSelectedDataAsync(
    base64Image,
    {
      coercionType: Office.CoercionType.Image
    },
    (asyncResult) => {
      if (asyncResult.status === Office.AsyncResultStatus.Failed) {
        setMessage("Error: " + asyncResult.error.message);
      }
    }
  );
}

function insertText() {
  Office.context.document.setSelectedDataAsync("Hello World!", (asyncResult) => {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      setMessage("Error: " + asyncResult.error.message);
    }
  });
}

function getSlideMetadata() {
  Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, (asyncResult) => {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      setMessage("Error: " + asyncResult.error.message);
    } else {
      setMessage("Metadata for selected slides: " + JSON.stringify(asyncResult.value));
    }
  });
}

// TODO9: Define the addSlides and navigation functions.

async function clearMessage(callback) {
  document.getElementById("message").innerText = "";
  await callback();
}

function setMessage(message) {
  document.getElementById("message").innerText = message;
}

// Default helper for invoking an action and handling errors.
async function tryCatch(callback) {
  try {
    document.getElementById("message").innerText = "";
    await callback();
  } catch (error) {
    setMessage("Error: " + error.toString());
  }
}