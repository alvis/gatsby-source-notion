# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.1 (2021-07-16)


### ✨ Features

* add pages' create time and last edited time in the frontmatter ([261de93](https://github.com/alvis/gatsby-source-notion/commit/261de930800e1df86a2331c303cdb9a5d7b3db53))
* add pages' flattened properties in the frontmatter ([0be8b1b](https://github.com/alvis/gatsby-source-notion/commit/0be8b1b0de03e926158d40ef097551a9388adbef))
* make preview possible in development mode ([7a889b3](https://github.com/alvis/gatsby-source-notion/commit/7a889b3152c7a555ac86da64ce3198192b32da7a))
* provide a cache mechanism for the client ([b4ffd32](https://github.com/alvis/gatsby-source-notion/commit/b4ffd320653837fa0a2144e5e3ee72af131c8e25))
* provide a gatsby node handler ([22c949d](https://github.com/alvis/gatsby-source-notion/commit/22c949d37b63461ddb0f6f802e82aca33c46cdf5))
* provide a notion to markdown parser ([f477672](https://github.com/alvis/gatsby-source-notion/commit/f477672e644bfa2bc097114e91a42c16374eadee))
* provide a property content extractor ([8edd425](https://github.com/alvis/gatsby-source-notion/commit/8edd4256e5b978d7e1eeeabd6dcc7a314e8e6e6c))
* provide a simple Notion client ([d3676ef](https://github.com/alvis/gatsby-source-notion/commit/d3676ef3ed1a0505b879d5a064867647a4e0383c))
* provide the essential procedures for generating nodes ([4599a28](https://github.com/alvis/gatsby-source-notion/commit/4599a28439e97cd233a8e76d40bdbf4ad0ecb517))
* **type:** add a placeholder for types ([66e33b1](https://github.com/alvis/gatsby-source-notion/commit/66e33b142071cdc96414208c9ef96e0016750c3f))
* **type:** provided data types in relation to content blocks ([8ef3461](https://github.com/alvis/gatsby-source-notion/commit/8ef3461b88bc23503df4ce1aa6a3d93e18c2e1aa))
* **type:** provided data types in relation to metadata and richtext ([07ae633](https://github.com/alvis/gatsby-source-notion/commit/07ae633633e7204ced5724915f913228eb832771))
* **type:** provided data types in relation to pages and databases ([5db89f4](https://github.com/alvis/gatsby-source-notion/commit/5db89f45a0b943e45b9942a9557b7edc7b6201d5))
* **type:** provided data types in relation to users ([c48f8ad](https://github.com/alvis/gatsby-source-notion/commit/c48f8ad4ef474318036987a9780eb690e06e0f17))
* use Gatsby cache for preserving data across APIs ([93d65bb](https://github.com/alvis/gatsby-source-notion/commit/93d65bb1e104d16e75b447a7ff61b551bbb4d6ac))


### 🐛 Bug Fixes

* avoid any escape in content for frontmatter by using js-yaml ([64bbdc9](https://github.com/alvis/gatsby-source-notion/commit/64bbdc9fbc64f32c6edcc669848849c4851085f3))
* ignore cache if last_edit_time is within the last minute ([ed7f863](https://github.com/alvis/gatsby-source-notion/commit/ed7f863a12c95f8c4816aeba2b0d3c326b6c694f))


### 🛠 Builds

* whitelist the root `gatsby-node.js` for npm release ([ad7a2e6](https://github.com/alvis/gatsby-source-notion/commit/ad7a2e61078bac0973f430c4060d2d5a908ae458))


### 📦 Code Refactoring

* use a helper for synchronising nodes ([310ce69](https://github.com/alvis/gatsby-source-notion/commit/310ce691d5a38bd2a01c2ac0d18e96234988f4d4))
* use generalised Gatsby Node API argument ([24b3e43](https://github.com/alvis/gatsby-source-notion/commit/24b3e4368edac733fc2ebccbd4dea2af081e00a6))
* use the universal property extractor to get the title ([0a954af](https://github.com/alvis/gatsby-source-notion/commit/0a954afcd6a55b20a162bd431c8a9a56d71b4138))
* user a helper for filling the default config in one place ([99c04f9](https://github.com/alvis/gatsby-source-notion/commit/99c04f938aa82649005d3acfb13b23fa0cc4af99))


### 📚 Documentation

* add a demo for the preview mode ([f2204c4](https://github.com/alvis/gatsby-source-notion/commit/f2204c4fcce218513155d883944599b5822bcd90))
* add a guide for contribution ([40f4e64](https://github.com/alvis/gatsby-source-notion/commit/40f4e64ebb5fd7ab2b4768016e1efee717fb4952))
* enrich the documentation ([e1b7368](https://github.com/alvis/gatsby-source-notion/commit/e1b736815edac59447d62f56c1daadc8012d4bb2))


### ♻️ Chores

* **release:** 1.0.0 ([96a4ba4](https://github.com/alvis/gatsby-source-notion/commit/96a4ba45df7ceae0d044e88e2dc5115064b8da1b))



# 1.0.0 (2021-07-16)


### ✨ Features

* add pages' create time and last edited time in the frontmatter ([261de93](https://github.com/alvis/gatsby-source-notion/commit/261de930800e1df86a2331c303cdb9a5d7b3db53))
* add pages' flattened properties in the frontmatter ([0be8b1b](https://github.com/alvis/gatsby-source-notion/commit/0be8b1b0de03e926158d40ef097551a9388adbef))
* make preview possible in development mode ([7a889b3](https://github.com/alvis/gatsby-source-notion/commit/7a889b3152c7a555ac86da64ce3198192b32da7a))
* provide a cache mechanism for the client ([b4ffd32](https://github.com/alvis/gatsby-source-notion/commit/b4ffd320653837fa0a2144e5e3ee72af131c8e25))
* provide a gatsby node handler ([22c949d](https://github.com/alvis/gatsby-source-notion/commit/22c949d37b63461ddb0f6f802e82aca33c46cdf5))
* provide a notion to markdown parser ([f477672](https://github.com/alvis/gatsby-source-notion/commit/f477672e644bfa2bc097114e91a42c16374eadee))
* provide a property content extractor ([8edd425](https://github.com/alvis/gatsby-source-notion/commit/8edd4256e5b978d7e1eeeabd6dcc7a314e8e6e6c))
* provide a simple Notion client ([d3676ef](https://github.com/alvis/gatsby-source-notion/commit/d3676ef3ed1a0505b879d5a064867647a4e0383c))
* provide the essential procedures for generating nodes ([4599a28](https://github.com/alvis/gatsby-source-notion/commit/4599a28439e97cd233a8e76d40bdbf4ad0ecb517))
* **type:** add a placeholder for types ([66e33b1](https://github.com/alvis/gatsby-source-notion/commit/66e33b142071cdc96414208c9ef96e0016750c3f))
* **type:** provided data types in relation to content blocks ([8ef3461](https://github.com/alvis/gatsby-source-notion/commit/8ef3461b88bc23503df4ce1aa6a3d93e18c2e1aa))
* **type:** provided data types in relation to metadata and richtext ([07ae633](https://github.com/alvis/gatsby-source-notion/commit/07ae633633e7204ced5724915f913228eb832771))
* **type:** provided data types in relation to pages and databases ([5db89f4](https://github.com/alvis/gatsby-source-notion/commit/5db89f45a0b943e45b9942a9557b7edc7b6201d5))
* **type:** provided data types in relation to users ([c48f8ad](https://github.com/alvis/gatsby-source-notion/commit/c48f8ad4ef474318036987a9780eb690e06e0f17))
* use Gatsby cache for preserving data across APIs ([93d65bb](https://github.com/alvis/gatsby-source-notion/commit/93d65bb1e104d16e75b447a7ff61b551bbb4d6ac))


### 🐛 Bug Fixes

* avoid any escape in content for frontmatter by using js-yaml ([64bbdc9](https://github.com/alvis/gatsby-source-notion/commit/64bbdc9fbc64f32c6edcc669848849c4851085f3))
* ignore cache if last_edit_time is within the last minute ([ed7f863](https://github.com/alvis/gatsby-source-notion/commit/ed7f863a12c95f8c4816aeba2b0d3c326b6c694f))


### 📦 Code Refactoring

* use a helper for synchronising nodes ([310ce69](https://github.com/alvis/gatsby-source-notion/commit/310ce691d5a38bd2a01c2ac0d18e96234988f4d4))
* use generalised Gatsby Node API argument ([24b3e43](https://github.com/alvis/gatsby-source-notion/commit/24b3e4368edac733fc2ebccbd4dea2af081e00a6))
* use the universal property extractor to get the title ([0a954af](https://github.com/alvis/gatsby-source-notion/commit/0a954afcd6a55b20a162bd431c8a9a56d71b4138))
* user a helper for filling the default config in one place ([99c04f9](https://github.com/alvis/gatsby-source-notion/commit/99c04f938aa82649005d3acfb13b23fa0cc4af99))


### 📚 Documentation

* add a demo for the preview mode ([f2204c4](https://github.com/alvis/gatsby-source-notion/commit/f2204c4fcce218513155d883944599b5822bcd90))
* add a guide for contribution ([40f4e64](https://github.com/alvis/gatsby-source-notion/commit/40f4e64ebb5fd7ab2b4768016e1efee717fb4952))
* enrich the documentation ([e1b7368](https://github.com/alvis/gatsby-source-notion/commit/e1b736815edac59447d62f56c1daadc8012d4bb2))
