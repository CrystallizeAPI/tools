const nameFilter = cat => {
  return ![
    'Select',
    'Sale',
    'Home',
    'Away',
    'Cali',
    'Lan\u00e7amentos',
    'Palmeiras',
    'Deva',
    'Suede',
    'RS-Collection',
    'Tend\u00eancias',
    'Cl\u00e1ssicos',
    'Hybrid',
    'LQD Cell',
    'Ralph Samson',
    'Rider',
    'It\u00e1lia',
    'Times Europeus',
    'Manchester City',
    'Essenciais',
    'Futebol',
    'RS 9.8',
    'RS Collection',
    'Hello Kitty',
    'Roma',
    'Cole\u00e7\u00f5es',
    'Karl Lagerfeld',
    'Maybelline',
    'Camisas',
    'Treino e Viagem',
    'Stadium',
    'Torcedor',
    'RS-X',
    'Third',
    'BMW Motorsport',
    'Mercedes AMG Petronas',
    'Scuderia Ferrari',
    'Red Bull Racing',
    'Motorsport'
  ].includes(cat.name)
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
