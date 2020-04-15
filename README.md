# crystallize-magento-import

## Importing Magento catalogue in Crystallize

This script allows easier transition from Magento to Crystallize. It handles importing of product and folder structure, while respecting product association to multiple folders.

### Modifications:

- Define the more generic Magento categories that will be imported in Crystallize following the modern topic-based approach.
- Define and handle the shape and content pushed to Crystallize.

- Define the way products and their variants are associated. Current logic is under lib/helpers/map-product.js
