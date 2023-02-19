const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;
const ALGORITHM = "sha3-512";
const ENCODING = "hex";

function encode(data) {
  return crypto.createHash(ALGORITHM).update(data).digest(ENCODING);
}

function stringify(data) {
  const isString = typeof data === "string";
  return isString ? data : JSON.stringify(data);
}

exports.deterministicPartitionKey = (event) => {
  let candidate;

  if (!event) return TRIVIAL_PARTITION_KEY;

  const hasPartitionKey = !!event?.partitionKey;
  candidate = hasPartitionKey
    ? stringify(event.partitionKey)
    : encode(stringify(event));

  if (candidate?.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = encode(candidate);
  }

  return candidate;
}

