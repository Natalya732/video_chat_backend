import crypto from "crypto";
import { parseBuffer } from "music-metadata";
import axios from "axios";

import { uploadAudio } from "./firebase.js";

const createError = (res, message, code = 400, err = "") => {
  res.status(code).json({
    success: false,
    message: message || "Something gone wrong",
    error: err,
  });
};

const createResponse = (res, data, code = 200) => {
  res.status(code).json({
    success: true,
    data,
  });
};

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const validateEmail = (email) => {
  if (!email) return false;
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

function formatSecondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = parseInt(seconds % 60);

  return `${minutes}:${
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
  }`;
}

function getBlobDuration(blob) {
  return new Promise((resolve, reject) => {
    blob.arrayBuffer().then(async (buffer) => {
      const audioBuffer = Buffer.from(buffer);

      const audioMetadata = await parseBuffer(audioBuffer, "audio/mp3");

      if (!audioMetadata) {
        console.log("Failed to read meta-data from audio");
        reject(0);
        return;
      }

      const durationInSeconds = audioMetadata.format.duration;
      resolve(durationInSeconds);
    });
  });
}

const getFileHashSha256 = async (blob) => {
  if (!blob) return;

  const uint8Array = new Uint8Array(await blob.arrayBuffer());
  const hashBuffer = await crypto.subtle.digest("SHA-256", uint8Array);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((h) => h.toString(16).padStart(2, "0")).join("");
};

function shuffleArray(arr = []) {
  if (!Array.isArray(arr) || !arr.length) return;

  const array = [...arr];
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export {
  createError,
  createResponse,
  validateEmail,
  formatSecondsToMinutesSeconds,
  getFileHashSha256,
  getBlobDuration,
  getRandomInteger,
  shuffleArray,
};
