const nameFilter = cat => {
  return !['Toys', 'Boys', 'Girls'].includes(cat.name)
}

const extractData = (cat, injections = {}) => {
  if (cat.children_data.length > 0) {
    return {
      magentoId: cat.id,
      name: cat.name,
      position: cat.position,
      is_active: cat.is_active,
      level: cat.level,
      children: cat.children_data.filter(nameFilter).map(extractData)
    }
  } else {
    return {
      magentoId: cat.id,
      name: cat.name,
      position: cat.position,
      is_active: cat.is_active,
      level: cat.level,
      products: cat.product_count
    }
  }
}

export default data => data.filter(nameFilter).map(extractData)
