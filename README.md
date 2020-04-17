# crystallize-magento-import

## Exporting Magento catalogue and importing/migrating to Crystallize

This script allows easier transition from Magento to [Crystallize](https://crystallize.com). It handles importing of product and folder structure, while respecting product association to multiple folders. You can use this script to import the product catalogue from Magento to Crystallize periodically or use it to migrate to Crystallize.

Crystallize is a fast GraphQL based [PIM](https://crystallize.com/product/product-information-management) to build [headless eCommerce](https://crystallize.com/product) solutions. If you are migrating from Magento to Crystallize you should check out the [Open Source React eCommerce Boilerplate](https://crystallize.com/learn/open-source/boilerplates/react-nextjs).

If you stumbled upon this script check out the concepts of how to build [fast React eCommerce](https://crystallize.com/developers) using Crystalize.

### Modifications:

- Define the more generic Magento categories that will be imported in Crystallize following the modern topic maps-based approach.
- Define and handle the shape and content pushed to Crystallize.

- Define the way products and their variants are associated. Current logic is under lib/helpers/map-product.js
