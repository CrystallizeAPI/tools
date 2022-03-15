# Crystallize Tools

Here are managed all the Crystallize Tools.

In order to simplify their maintenance they are all in this Git Repository.

All contributions will happen here:

- PRs and Issues are therefore open, discuss, contribute in one place
- Many things will be shared accross the `components`: Coding Standards, CI & Automations, Tests, etc.

✅ Nevertheless, all the `compoenents` (here tools) will continue to be independant and pushed in their own repository. (through magic mechanisms that we have internally)

## Managed Repositories

| Tools                                                                          | Licence(s) |
| ------------------------------------------------------------------------------ | ---------- |
| [Shopify Migrator](https://github.com/CrystallizeAPI/shopify-migration-script) | ![MIT]     |

## Contributions

- Pull Requests and Issues should start with `[$COMPONENT_NAME]`

## Adding a new Component (Tool)

```bash
make add-component COMPONENT=my-new-component
```

> If not already done, you still need create the Github sub-repository and add an entry in `components/manifest.json`

[mit]: https://img.shields.io/badge/license-MIT-green?style=flat-square&labelColor=black
