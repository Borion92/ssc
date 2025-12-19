interface CityStandard {
  city_name: string
  year: number
  base_min: number
  base_max: number
  rate: number
}

interface SalaryData {
  employee_id: string
  employee_name: string
  month: number
  salary_amount: number
}

interface CalculationResult {
  employee_name: string
  avg_salary: number
  contribution_base: number
  rate: number
  company_fee_month: number
  company_fee_year: number
  year: number
  city_name: string
}

// Calculate social security contributions
export function calculateContributions(
  salaries: SalaryData[],
  cityStandard: CityStandard,
  year: number
): CalculationResult[] {
  // Filter salaries by year
  const yearSalaries = salaries.filter(s => {
    // Handle different month formats
    if (typeof s.month === 'number') {
      // If it's a regular YYYYMM format
      if (s.month > 200000 && s.month < 300000) {
        return Math.floor(s.month / 100) === year
      }
      // If it's an Excel date number
      if (s.month > 40000) {
        const date = new Date((s.month - 25569) * 86400 * 1000)
        return date.getFullYear() === year
      }
    }
    return false
  })

  // Group by employee name
  const employeeGroups = yearSalaries.reduce((groups, salary) => {
    if (!groups[salary.employee_name]) {
      groups[salary.employee_name] = []
    }
    groups[salary.employee_name].push(salary)
    return groups
  }, {} as Record<string, SalaryData[]>)

  // Calculate for each employee
  const results: CalculationResult[] = Object.entries(employeeGroups).map(
    ([employeeName, employeeSalaries]) => {
      // Calculate average salary
      const totalSalary = employeeSalaries.reduce(
        (sum, s) => sum + s.salary_amount, 0
      )
      const avgSalary = totalSalary / employeeSalaries.length

      // Determine contribution base using clamp logic
      const contributionBase = Math.max(
        cityStandard.base_min,
        Math.min(avgSalary, cityStandard.base_max)
      )

      // Calculate company fees
      const companyFeeMonth = contributionBase * cityStandard.rate
      const companyFeeYear = companyFeeMonth * 12

      return {
        employee_name: employeeName,
        avg_salary: Math.round(avgSalary * 100) / 100, // Round to 2 decimal places
        contribution_base: Math.round(contributionBase * 100) / 100,
        rate: cityStandard.rate,
        company_fee_month: Math.round(companyFeeMonth * 100) / 100,
        company_fee_year: Math.round(companyFeeYear * 100) / 100,
        year: year,
        city_name: cityStandard.city_name
      }
    }
  )

  return results
}