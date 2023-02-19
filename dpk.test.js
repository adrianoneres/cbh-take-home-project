const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();

    expect(trivialKey).toBe("0");
  });

  it("Returns the partitionKey when given", () => {
    const event = { partitionKey: 'test' };

    const trivialKey = deterministicPartitionKey(event);

    expect(trivialKey).toBe(event.partitionKey);
  });

  it("Returns the encrypted event data when no partitionKey is informed", () => {
    const event = { key: 'test' };
    const data = JSON.stringify(event);
    const expected = crypto.createHash("sha3-512").update(data).digest("hex");

    const trivialKey = deterministicPartitionKey(event);

    expect(trivialKey).toBe(expected);
  });

  it("Returns the encrypted partitionKey when a long partitionKey is informed", () => {
    const event = { partitionKey: 'a'.repeat(260) };
    const data = event.partitionKey;
    const expected = crypto.createHash("sha3-512").update(data).digest("hex");

    const trivialKey = deterministicPartitionKey(event);

    expect(trivialKey).toBe(expected);
  });

  it("Returns the encrypted data when a long event with no partitionKey is informed", () => {
    const event = { key: 'a'.repeat(260) };
    const data = JSON.stringify(event);
    const expected = crypto.createHash("sha3-512").update(data).digest("hex");

    const trivialKey = deterministicPartitionKey(event);

    expect(trivialKey).toBe(expected);
  });
});
