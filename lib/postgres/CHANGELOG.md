# Changelog

## [1.1.5](https://github.com/rmolinamir/ddd-framework/compare/@ddd-framework/postgres-v1.1.4...${npm.name}-v1.1.5) (2025-01-19)


### Bug Fixes

* **postgres:** fixed nestjs module providers ([3dff154](https://github.com/rmolinamir/ddd-framework/commit/3dff154bf3c88ae25e6f2f8025d08a5929f9b76d))

## [1.1.4](https://github.com/rmolinamir/ddd-framework/compare/@ddd-framework/postgres-v1.1.3...${npm.name}-v1.1.4) (2024-12-22)


### Bug Fixes

* **postgres:** transaction-manager no longer catches rollaback errors ([9a4ec6a](https://github.com/rmolinamir/ddd-framework/commit/9a4ec6ad086a2d55191b1502a18954d6c53cc1d7))

## [1.1.3](https://github.com/rmolinamir/ddd-framework/compare/@ddd-framework/postgres-v1.1.2...${npm.name}-v1.1.3) (2024-12-22)


### Features

* **aggregate-root:** added aggregate members logic and allowed entities to raise domain events ([bae9fe5](https://github.com/rmolinamir/ddd-framework/commit/bae9fe59e279e6f8132b78e22957e8a16f76c6ab))
* **core:** new aggregate-members logic is exportable ([15d5e34](https://github.com/rmolinamir/ddd-framework/commit/15d5e34685397b8bb44914f6771660247d93bbb6))
* **transaction-manager:** the transactions are now capable of returning results ([5ec2894](https://github.com/rmolinamir/ddd-framework/commit/5ec289426abea4e07ee0adcb8f3f5feef296d4c3))


### Bug Fixes

* **aggregate members:** fixed typo and support for no aggregate members ([1bac1ba](https://github.com/rmolinamir/ddd-framework/commit/1bac1ba6d90d2065dd6b17c75ad3ade9fcfd5e4e))
* **entity:** entities can raise domain events without aggregate IDs ([165e1ce](https://github.com/rmolinamir/ddd-framework/commit/165e1ce818fac9703cd680669cf11b53d3789dd8))
* **entity:** updated test ([b9eb606](https://github.com/rmolinamir/ddd-framework/commit/b9eb606f78a5cab6148ae45f69fe4b0deb166d54))
* **event sink:** removed potential memory leak ([dbd1f0f](https://github.com/rmolinamir/ddd-framework/commit/dbd1f0fa7491e577b531be479a068105966be1bd))

## [1.1.2](https://github.com/rmolinamir/ddd-framework/compare/@ddd-framework/postgres-v1.1.1...${npm.name}-v1.1.2) (2024-08-09)

## [1.1.1](https://github.com/rmolinamir/ddd-framework/compare/@ddd-framework/postgres-v1.1.0...${npm.name}-v1.1.1) (2024-08-09)

## [1.1.0](https://github.com/rmolinamir/ddd-framework/compare/@ddd-framework/postgres-v1.0.1...${npm.name}-v1.1.0) (2024-08-09)

## [1.0.1](https://github.com/rmolinamir/ddd-framework/compare/@ddd-framework/postgres-v1.0.0...${npm.name}-v1.0.1) (2024-08-07)


### Features

* **repository:** added support for the transaction pattern ([9c0e069](https://github.com/rmolinamir/ddd-framework/commit/9c0e069b8256a1d9a93c3115d75076d0270d7cb8))

## 1.0.0 (2024-08-05)


### Features

* **@ddd-framework/collections:** entityCollection now supports Entity keys | `from` improvements ([18203ae](https://github.com/rmolinamir/ddd-framework/commit/18203ae49098f81e7b1886df41043ee323ec2369))
* **@ddd-framework/core:** new list constructor overload and presenter port ([13a6ad5](https://github.com/rmolinamir/ddd-framework/commit/13a6ad52a235a4d44f9bd017d3713a3135e27c1e))
* **@ddd-framework:** init ([b2a1717](https://github.com/rmolinamir/ddd-framework/commit/b2a17178214acc55eb470c4e00a3815daec8b77f))
* **@ddd-framework:** monorepo ([56fd484](https://github.com/rmolinamir/ddd-framework/commit/56fd48463ddb0354aeeb1ddc6b53c0cf1048395a))
* **core:** experimental DDD tactical pattern decorators ([14c889e](https://github.com/rmolinamir/ddd-framework/commit/14c889e391cd0b22db73c68bd61e0b184204fecb))
* **core:** experimental decorators for Aggregate Root, Member, and other DDD tactical patterns ([52c3df5](https://github.com/rmolinamir/ddd-framework/commit/52c3df5587369b098808c5664ab95cec1f85860f))
* **core:** experimental module progress ([1f376dd](https://github.com/rmolinamir/ddd-framework/commit/1f376dd6e0d7c6706ddc2eb1ad9fba8ef0469776))
* **core:** removed static null from IdentifiedDomainObject class | removed DomainEventClassMap ([896f06d](https://github.com/rmolinamir/ddd-framework/commit/896f06dfb899461ab6b465792e6eb0754a09580b))
* **mongodb:** dDD framework mongodb adapter ([f2b014a](https://github.com/rmolinamir/ddd-framework/commit/f2b014a3a90912e1102c0c1b56a523535361a639))
* **postgres:** dDD framework postgres adapter ([061a115](https://github.com/rmolinamir/ddd-framework/commit/061a1152e06580486d5533625699557712d64c30))
* **seedwork:** internal [@config](https://github.com/config) packages are ignored | internal directories __**__ are ignored ([375033f](https://github.com/rmolinamir/ddd-framework/commit/375033f82babb53874dd92d8f9de540ed5d569a5))
* **uuid:** uuid package ([3dcc796](https://github.com/rmolinamir/ddd-framework/commit/3dcc7960242eb215196fa1adb2c733ece395bad4))
* **v0:** refactored the classes into a more modular structure ([9b9e479](https://github.com/rmolinamir/ddd-framework/commit/9b9e479b75f18a6e5f2f6fb79fbec1c03006ef91))
* **v1:** v1 [@ddd-framework](https://github.com/ddd-framework) refactor using decorators for the core module plus seedwork support ([bacda4c](https://github.com/rmolinamir/ddd-framework/commit/bacda4cc3e3fad7ed4d1607411910113943d2e8e))


### Bug Fixes

* **@ddd-framework/collections:** generic type fix ([6252ced](https://github.com/rmolinamir/ddd-framework/commit/6252ced49ecd8f201f21666b489ca423fc1b2312))
* **@ddd-framework/collections:** type improvements | now attempting to unpack entity IDs ([c2ddb72](https://github.com/rmolinamir/ddd-framework/commit/c2ddb720f0319043474a73d8687814760978be8c))
* **@ddd-framework/core:** added details to exceptions thrown in domain events module ([984cac9](https://github.com/rmolinamir/ddd-framework/commit/984cac94aee0680dae2fe9d64701c2759910a63c))
* **@ddd-seedwork:** adapted seedwork to new monorepo ([715a147](https://github.com/rmolinamir/ddd-framework/commit/715a147fa7986a43abe090c71e9ad4bb77f920a3))
* **core:** removed logs ([dfaf76f](https://github.com/rmolinamir/ddd-framework/commit/dfaf76f4987723a20d00590cf54faf012e7b4535))
