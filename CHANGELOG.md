# Changelog

All notable changes to Prettylus will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.4] - 2024

### Added

- Enhanced Prettier plugin loading with better error handling
- Improved plugin resolution for monorepo environments
- Better debug logging for troubleshooting formatting issues

### Fixed

- Plugin resolution issues in complex project structures
- Proper handling of Prettier config with plugin arrays

## [0.3.3] - 2024

### Changed

- Upgraded to Prettier 3.x for better performance and new features
- Improved compatibility with latest @prettier/plugin-pug

## [0.3.2] - 2024

### Added

- Support for `prettierBaseDirectory` configuration option
- Support for `prettierConfigFile` configuration option
- Better monorepo support with configurable base paths

### Fixed

- Config resolution in nested project structures

## [0.3.1] - 2023

### Changed

- Rolled back to Prettier < 3 (^2.8.8) for stability

## [0.3.0] - 2023

### Changed

- **BREAKING:** Upgraded to Prettier 3
- Improved performance with new Prettier APIs

## [0.2.9] - 2023

### Fixed

- Properly use Prettier > 2.8.8 as intended

## [0.2.8] - 2023

### Changed

- Reverted to Prettier < 3 (^2.8.8) for compatibility

## [0.2.7] - 2023

### Changed

- Build process now uses webpack for smaller bundle size
- Improved extension load time

## [0.2.6] - 2023

### Changed

- Switched build process to TypeScript compiler (`tsc`)
- Better source maps for debugging

## [0.2.5] - 2023

### Changed

- Bundled `@prettier/plugin-pug` directly
- Removed minification to help identify potential errors

## [0.2.4] - 2023

### Fixed

- ESM/CJS import issues with Prettier v3
- No longer externalizing Prettier for better compatibility

## [0.2.3] - 2023

### Changed

- Updated `@prettier/plugin-pug` to latest version

## [0.2.2] - 2023

### Changed

- Updated Prettier to handle TypeScript `satisfies` keyword properly

## [0.2.1] - 2023

### Enhanced

- More versatile support for style tags (now allows all attributes)
- Better handling of complex style tag configurations

## [0.2.0] - 2023

### Added

- 🎉 Support for multiple style tags in a single file
- Improved style block detection and formatting

## [0.1.12] - 2023

### Fixed

- Downgraded `lru-cache` dependency to resolve compatibility issues

## [0.1.11] - 2023

### Fixed

- Re-added missing `lru-cache` dependency

## [0.1.10] - 2023

### Changed

- Froze dependencies for stability
- Removed `lru-cache` dependency

## [0.1.9] - 2023

### Fixed

- Added missing `lru-cache` dependency

## [0.1.8] - 2023

### Added

- Support for `scoped` styles in Vue components
- Preserve all style tag attributes during formatting

## [0.1.7] - 2023

### Changed

- Updated `@prettier/plugin-pug` to latest version

## [0.1.6] - 2023

### Fixed

- Prevented cache when resolving Prettier config for live reload of changes

## [0.1.5] - 2023

### Fixed

- Build process missing dependencies
- Now using esbuild with no-yarn publish option

## [0.1.1] - 2022

### Added

- Users can now override VS Code settings from `.stylusrc`
- Better integration with existing Stylus configurations

## [0.1.0] - 2022

### Added

- 🎉 Initial release of Prettylus
- Format Vue SFCs with Prettier for template/script blocks
- Format Stylus blocks with Stylus Supremacy
- Support for Pug templates via `@prettier/plugin-pug`
- Configurable Stylus config file name
- VS Code marketplace release

[0.3.4]: https://github.com/qnp/prettylus/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/qnp/prettylus/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/qnp/prettylus/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/qnp/prettylus/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/qnp/prettylus/compare/v0.2.9...v0.3.0
[0.2.9]: https://github.com/qnp/prettylus/compare/v0.2.8...v0.2.9
[0.2.8]: https://github.com/qnp/prettylus/compare/v0.2.7...v0.2.8
[0.2.7]: https://github.com/qnp/prettylus/compare/v0.2.6...v0.2.7
[0.2.6]: https://github.com/qnp/prettylus/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/qnp/prettylus/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/qnp/prettylus/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/qnp/prettylus/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/qnp/prettylus/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/qnp/prettylus/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/qnp/prettylus/compare/v0.1.12...v0.2.0
[0.1.12]: https://github.com/qnp/prettylus/compare/v0.1.11...v0.1.12
[0.1.11]: https://github.com/qnp/prettylus/compare/v0.1.10...v0.1.11
[0.1.10]: https://github.com/qnp/prettylus/compare/v0.1.9...v0.1.10
[0.1.9]: https://github.com/qnp/prettylus/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/qnp/prettylus/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/qnp/prettylus/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/qnp/prettylus/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/qnp/prettylus/compare/v0.1.1...v0.1.5
[0.1.1]: https://github.com/qnp/prettylus/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/qnp/prettylus/releases/tag/v0.1.0
