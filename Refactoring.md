# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

I started extracting the constants from the function code, to avoid recreating them at each function call. I also created two more constants, that are used inside the new `encode` function, to improve its readability.

My next approach was to extract the repeated code to their own functions (`encode` and `stringify`), this way, I make sure to avoid repetition and also, am aiming to make the `deterministicPartitionKey` a function that has a single responsibility of defining and returning the partition key. So, its logic is now more focused on it, and any "side-logic" such as data handling are separated inside the new `encode` and `stringify` functions.

Last, but not least, I aimed to identify any possible early returns, to avoid unnecessary processing with unnecessary if blocks, that's why the check for the empty `event` is now at the beginning of the function.

Also, worth saying that, personally, I like to create some auxiliary variables/consts, to improve the code readability. That's why I created both `isString` and `hasPartitionKey`. These constants aren't really necessary, but I believe it improves a lot the code quality and readability for other people who come to read this in the future.