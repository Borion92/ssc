import * as xlsx from 'xlsx'

// Parse cities Excel file
export function parseCitiesExcel(buffer: ArrayBuffer) {
  const workbook = xlsx.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 })

  console.log('Cities Raw Excel data:', data.slice(0, 5)) // Debug

  // Check if first row is headers
  const firstRow = data[0] as string[]
  const hasHeaders = firstRow && (
    firstRow.includes('city_name') ||
    firstRow.includes('cityName') ||
    firstRow.includes('城市名称') ||
    firstRow.includes('城市') ||
    firstRow.includes('年份') ||
    firstRow.includes('year')
  )

  console.log('Cities Has headers:', hasHeaders) // Debug

  // Start from row 1 if has headers, otherwise from row 0
  const startIndex = hasHeaders ? 1 : 0
  const rows = data.slice(startIndex) as any[][]

  console.log('Cities Processing rows:', rows.slice(0, 5)) // Debug

  const cities = rows.map(row => {
    // Handle different column orders
    // Expected: city_name, year, base_min, base_max, rate
    // Or with ID: id, city_name, year, rate, base_min, base_max
    const hasIdColumn = typeof row[0] === 'number' && row[0] === parseInt(String(row[0]))

    if (hasIdColumn) {
      // Format: id, city_name, year, rate, base_min, base_max
      return {
        city_name: String(row[1]),
        year: parseInt(row[2]),
        base_min: parseFloat(row[4]),
        base_max: parseFloat(row[5]),
        rate: parseFloat(row[3])
      }
    } else {
      // Format: city_name, year, base_min, base_max, rate
      return {
        city_name: String(row[0]),
        year: parseInt(row[1]),
        base_min: parseFloat(row[2]),
        base_max: parseFloat(row[3]),
        rate: parseFloat(row[4])
      }
    }
  }).filter(city =>
    city.city_name &&
    !isNaN(city.year) &&
    city.year > 2000 &&
    city.year < 2100 &&
    !isNaN(city.base_min) &&
    !isNaN(city.base_max) &&
    !isNaN(city.rate)
  )

  console.log('Parsed cities count:', cities.length) // Debug
  console.log('Sample parsed city:', cities[0]) // Debug

  return cities
}

// Parse salaries Excel file
export function parseSalariesExcel(buffer: ArrayBuffer) {
  const workbook = xlsx.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 })

  console.log('Raw Excel data:', data.slice(0, 5)) // Debug: show first 5 rows

  // Check if first row is headers
  const firstRow = data[0] as string[]
  const hasHeaders = firstRow && (
    firstRow.includes('employee_id') ||
    firstRow.includes('employeeId') ||
    firstRow.includes('员工工号') ||
    firstRow.includes('员工编号') ||
    firstRow.includes('姓名') ||
    firstRow.includes('考勤月份') ||
    firstRow.includes('应发工资')
  )

  console.log('Has headers:', hasHeaders) // Debug

  // Start from row 1 if has headers, otherwise from row 0
  const startIndex = hasHeaders ? 1 : 0
  const rows = data.slice(startIndex) as any[][]

  console.log('Processing rows:', rows.slice(0, 5)) // Debug: show first 5 data rows

  const salaries = rows.map(row => {
    // Handle different date formats for month
    let monthValue = row[2]
    let monthStr = ''

    if (typeof monthValue === 'number') {
      // Check if it's already in YYYYMM format (like 202401)
      if (monthValue > 200000 && monthValue < 210000) {
        monthStr = String(monthValue)
      } else if (monthValue > 40000) {
        // Excel stores dates as numbers (days since 1900)
        const date = new Date((monthValue - 25569) * 86400 * 1000)
        monthStr = date.getFullYear() * 100 + (date.getMonth() + 1)
      } else {
        monthStr = String(monthValue)
      }
    } else if (monthValue instanceof Date) {
      // If it's a Date object, format as YYYYMM
      monthStr = monthValue.getFullYear() * 100 + (monthValue.getMonth() + 1)
    } else {
      // Try to parse as string
      monthStr = String(monthValue).trim()
    }

    const monthInt = parseInt(monthStr)

    return {
      employee_id: String(row[0]),
      employee_name: String(row[1]),
      month: monthInt,
      salary_amount: parseFloat(row[3])
    }
  }).filter(salary => {
    return salary.employee_id &&
           salary.employee_name &&
           !isNaN(salary.month) &&
           salary.month > 200000 && // Reasonable month format (YYYYMM)
           !isNaN(salary.salary_amount) &&
           salary.salary_amount > 0
  })

  console.log('Parsed salaries count:', salaries.length) // Debug
  console.log('Sample parsed salary:', salaries[0]) // Debug

  return salaries
}