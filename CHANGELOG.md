# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [1.2.0](https://github.com/alvis/gatsby-source-notion/compare/v1.1.0...v1.2.0) (2022-08-31)


### ✨ Features

* support image block ([0bb73c8](https://github.com/alvis/gatsby-source-notion/commit/0bb73c8199784a2d3266c5b7ddfe2c5fbed1fbeb)), closes [#4](https://github.com/alvis/gatsby-source-notion/issues/4)


### 🐛 Bug Fixes

* update package dependencies ([1554130](https://github.com/alvis/gatsby-source-notion/commit/15541306a51421d39802741b36ce695e105eddcb))


### 🚨 Tests

* remove potential set environment variable to avoid interference ([d5e9c46](https://github.com/alvis/gatsby-source-notion/commit/d5e9c4668421b4c4183455b8f24dc77faa9c24a6))


### ⚙️ Continuous Integrations

* update config with alias to fix node versions ([2534e77](https://github.com/alvis/gatsby-source-notion/commit/2534e777615073859758e8ffb413351d61cca15f))



# [1.1.0](https://github.com/alvis/gatsby-source-notion/compare/v1.0.5...v1.1.0) (2022-06-08)


### ✨ Features

* add support for cover and icon ([3e0c3e7](https://github.com/alvis/gatsby-source-notion/commit/3e0c3e7d6ca6cf6750f5591c29c14edf523939b9))
* add support for created by and last edited by ([e0a41d9](https://github.com/alvis/gatsby-source-notion/commit/e0a41d9617165b5ae6f3a18909ea11c8e7a0645c))
* use Notion client for better compatibility ([979b057](https://github.com/alvis/gatsby-source-notion/commit/979b0578915d281a64b4444a658c1984c0e4ef23))


### 🛠 Builds

* remove the now unnecessay ts-node hack ([37109ea](https://github.com/alvis/gatsby-source-notion/commit/37109eaa4ba4873b82e36fbe1f9b8610ed9d3d10))
* update presetter to v3.2 ([7cbbcaa](https://github.com/alvis/gatsby-source-notion/commit/7cbbcaac9586cb2c27785bfa16b4570b497e2f3e))


### 📦 Code Refactoring

* use Americian English ([fe3c276](https://github.com/alvis/gatsby-source-notion/commit/fe3c27640593f5f3bf518b71e07f98b6780d57cb))


### 🚨 Tests

* update gatsby config in the e2e test ([5f80191](https://github.com/alvis/gatsby-source-notion/commit/5f80191de0075befa8a8afc984368d3f0c9c7fc5))


### ⚙️ Continuous Integrations

* run tests on master branches only ([ba0d696](https://github.com/alvis/gatsby-source-notion/commit/ba0d696f44214f3cc1cef9aee7f08a9f0e24974f))


### 💎 Styles

* fix issues with latest linter rules ([d4ae392](https://github.com/alvis/gatsby-source-notion/commit/d4ae39239383fd99c338ed0df18b33302814e6d1))



## [1.0.5](https://github.com/alvis/gatsby-source-notion/compare/v1.0.4...v1.0.5) (2021-11-04)


### 🐛 Bug Fixes

* support gatsby v4 ([61e6094](https://github.com/alvis/gatsby-source-notion/commit/61e6094b53a18eecd50961f8bb2abb3fec5aa906))


### 🛠 Builds

* update presetter to v3 ([77a95cb](https://github.com/alvis/gatsby-source-notion/commit/77a95cb74b43cc0932fd23a9d82364d0242fd185))


### 🚨 Tests

* provide an end to end test for the plugin ([b014e02](https://github.com/alvis/gatsby-source-notion/commit/b014e02738d99f5917eefa3b64b74af7082c84d6))


### ⚙️ Continuous Integrations

* update node setup ([5514eb9](https://github.com/alvis/gatsby-source-notion/commit/5514eb91c2cd9bc16a7aeceda9d693a6d84609a8))



## [1.0.4](https://github.com/alvis/gatsby-source-notion/compare/v1.0.3...v1.0.4) (2021-09-26)


### 🐛 Bug Fixes

* ensure that a page update won't propagate to its database node ([c97d301](https://github.com/alvis/gatsby-source-notion/commit/c97d30160d16bf93657f91538e3520a310eee38a))


### ⚙️ Continuous Integrations

* add an automated vulnerability test by Github CodeQL ([8c9d178](https://github.com/alvis/gatsby-source-notion/commit/8c9d17896d04819c7a93f0f123102c33bcb6278b))


### 💎 Styles

* fix some formatting issues on the import statements ([2c7e4ff](https://github.com/alvis/gatsby-source-notion/commit/2c7e4ff14b624f5767ca88d77c878fabcafe4095))



## [1.0.3](https://github.com/alvis/gatsby-source-notion/compare/v1.0.2...v1.0.3) (2021-09-04)


### 🐛 Bug Fixes

* retain all current nodes for the next build ([495d9e6](https://github.com/alvis/gatsby-source-notion/commit/495d9e669dcca663c90a397603e796b87ad625f3))



## [1.0.2](https://github.com/alvis/gatsby-source-notion/compare/v1.0.1...v1.0.2) (2021-09-03)


### 🐛 Bug Fixes

* allow no spacing between IDs in those environment variables ([caaab11](https://github.com/alvis/gatsby-source-notion/commit/caaab11ebeddf154401b21280d587989390f3d02))
* correct the option schema ([6e483d7](https://github.com/alvis/gatsby-source-notion/commit/6e483d703f43c6c9e4b645dcf779a85d94e6d252))
* persist nodes over reruns ([ade9379](https://github.com/alvis/gatsby-source-notion/commit/ade9379404595e5ed92b0649341929be751a18ae))
* use Gatsby's digest function instead of sha ([e683066](https://github.com/alvis/gatsby-source-notion/commit/e683066b6b5b9f3e1bfded466cf7b9703ec1956e))


### 📚 Documentation

* fix the Postman collection link ([1e933bc](https://github.com/alvis/gatsby-source-notion/commit/1e933bc4a4369eb628c67f8c1a580558d589fdeb))
* remove the Logo link ([2cd6fbf](https://github.com/alvis/gatsby-source-notion/commit/2cd6fbf00ec0d21030d8d57c38a1a33ef095e310))



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
