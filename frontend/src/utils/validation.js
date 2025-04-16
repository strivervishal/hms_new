// Form validation utilities
export const validateCardNumber = (number) => {
  const regex = /^[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}$/
  return regex.test(number.replace(/\s/g, ''))
}

export const validateExpiryDate = (date) => {
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
  if (!regex.test(date)) return false
  
  const [month, year] = date.split('/')
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
  const today = new Date()
  return expiry > today
}

export const validateCVV = (cvv) => {
  const regex = /^[0-9]{3,4}$/
  return regex.test(cvv)
}

export const formatCardNumber = (number) => {
  const cleaned = number.replace(/\s/g, '')
  const chunks = cleaned.match(/.{1,4}/g) || []
  return chunks.join(' ')
}

// Date formatting utilities
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

// Currency formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}